import { useEffect, useState } from 'react';
import { compareAsc, format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import VotingPodium from './VotingPodium';
import VotersDialog from './VotersDialog';
import ShareDialog from './ShareDialog';
import { postVote } from '@/services/VoteService';
import { getRoom } from '@/services/RoomService';
import { Link, useParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Calendar, CalendarCheck, Clock } from 'lucide-react';
import adaptTimeSlots from '@/utils/adaptTimeSlots';
import convertTimeSlotsToUUIDs from '@/utils/convertTimeSlotsToUUIDs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { voteSchema } from '@/schemas/voteShema';
import { TimeSlot, Vote } from '@/types/vote';
import { RoomAPIResponse } from '@/types/room';

const VotingRoom = () => {
  const { roomId } = useParams();
  const [showShareDialog, setShowShareDialog] = useState(true);
  const [showVotersDialog, setShowVotersDialog] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [room, setRoom] = useState<RoomAPIResponse>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      name: '',
      email: '',
      selectedSlots: [],
    },
  });

  watch('selectedSlots');

  useEffect(() => {
    async function fetchRoom(roomId: string) {
      try {
        const apiRoom = await getRoom(roomId);

        setRoom(apiRoom);
        setTimeSlots(adaptTimeSlots(apiRoom));
      } catch (error) {
        console.error('Erro ao buscar a sala:', error);
        toast.error('Erro ao carregar a sala de votação.');
      }
    }

    if (roomId) {
      fetchRoom(roomId);
    }
  }, [roomId]);

  const groupedSlots: { [key: string]: TimeSlot[] } = {};
  timeSlots.forEach((slot) => {
    const day = format(parseISO(slot.dateTime), 'EEEE', { locale: ptBR });
    if (!groupedSlots[day]) {
      groupedSlots[day] = [];
    }
    groupedSlots[day].push(slot);
  });

  Object.keys(groupedSlots).forEach((day) => {
    groupedSlots[day].sort((a, b) => compareAsc(parseISO(a.dateTime), parseISO(b.dateTime)));
  });

  const onSubmit = async (data: FieldValues) => {
    if (!room) {
      toast.error('Erro ao carregar a sala. Tente novamente.');
      return;
    }

    const userAlreadyVoted = room.Time.some((timeSlot) => timeSlot.Vote.some((vote) => vote.userName === data.name));

    if (userAlreadyVoted) {
      toast.error('Você já votou nesta sala com esse nome.');
      return;
    }

    const newVote: Vote = {
      name: data.name,
      email: data.email || undefined,
      timeSlots: convertTimeSlotsToUUIDs(data.selectedSlots, room),
    };

    const updatedTimeSlots = timeSlots.map((slot) => {
      if (data.selectedSlots.includes(slot.dateTime)) {
        return {
          ...slot,
          votes: [...slot.votes, newVote],
        };
      }
      return slot;
    });

    setTimeSlots(updatedTimeSlots);

    const votePromise = postVote(newVote);

    toast.promise(votePromise, {
      loading: 'Registrando voto...',
      success: 'Voto registrado com sucesso.',
      error: 'Erro ao votar.',
    });

    await votePromise;

    setValue('name', '');
    setValue('email', '');
    setValue('selectedSlots', []);
  };

  const onError = (errors) => {
    if (errors.selectedSlots) {
      toast.error(errors.selectedSlots.message);
    }
  };

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const date = format(new Date(slot.dateTime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const sortedDates = Object.keys(groupedTimeSlots).sort();

  const handleSlotClick = (dateTime: string) => {
    const currentSlots = getValues('selectedSlots') || [];
    const newSlots = currentSlots.includes(dateTime) ? currentSlots.filter((slot) => slot !== dateTime) : [...currentSlots, dateTime];

    setValue('selectedSlots', newSlots);
  };

  const handleShowVoters = (slot: TimeSlot) => {
    setValue('selectedSlots', [slot.dateTime]);
    setShowVotersDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 w-full mx-auto">
      <TooltipProvider>
        <div className="container mx-auto max-w-5xl space-y-8 px-4">
          <header className="flex items-center justify-between mb-8">
            <Link to={'/'}>
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">MeetSync</span>
              </div>
            </Link>
          </header>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Sala de Votação</h1>
            <p className="text-muted-foreground">Escolha os horários que melhor se adequam à sua agenda</p>
          </div>
          <Card>
            <CardHeader>
              <div className="flex gap-2">
                <div>📌</div>
                <div className="flex flex-col space-y-1 min-w-0">
                  <CardTitle className="text-xl sm:text-normal">{room?.title || 'Título'}</CardTitle>
                  <CardDescription className="truncate pb-2">{room?.description || 'Descrição'}</CardDescription>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>
                    <strong>Data de criação:</strong> {format(room?.createdAt || new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2 flex-wrap">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>
                    <strong>Última atualização:</strong> {format(room?.updatedAt || new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Card className="p-4 rounded-lg shadow-md border bg-white mx-auto max-w-4xl sm:w-min">
                  <div className="relative">
                    <div className="overflow-x-auto">
                      <div className="flex sticky top-0 bg-white z-10">
                        <div className="min-w-[100px] p-4 font-semibold border-r bg-foreground/10 rounded-l-md">Horários</div>
                        {sortedDates.map((date, index) => {
                          const utcDate = toZonedTime(parseISO(date), 'UTC');
                          return (
                            <div
                              key={date}
                              className={`min-w-[140px] p-4 font-semibold text-center border-r bg-foreground/10 capitalize flex flex-col
                ${index === sortedDates.length - 1 ? 'rounded-r-md' : ''}`}
                            >
                              <span>{format(utcDate, 'EEEE', { locale: ptBR })}</span>
                              <span className="text-muted-foreground text-xs">{format(utcDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                            </div>
                          );
                        })}
                      </div>
                      <ScrollArea className="h-96 w-max">
                        <div className="flex w-max pt-1">
                          <div className="min-w-[100px] border-r">
                            {Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`).map((time) => (
                              <div key={time} className="text-xs p-4 border-b h-[100px] flex items-center justify-center">
                                {time}
                              </div>
                            ))}
                          </div>
                          {sortedDates.map((date) => (
                            <div key={date} className="min-w-[140px] border-r flex flex-col items-center">
                              {Array.from({ length: 24 }, (_, hour) => {
                                const slotTime = `${String(hour).padStart(2, '0')}:00`;
                                const matchingSlot = timeSlots.find(
                                  (slot) =>
                                    format(toZonedTime(parseISO(slot.dateTime), 'UTC'), 'yyyy-MM-dd') === date &&
                                    format(toZonedTime(parseISO(slot.dateTime), 'UTC'), 'HH:mm') === slotTime
                                );
                                return (
                                  <div key={slotTime} className="w-full flex justify-center items-center h-[100px]">
                                    {matchingSlot ? (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant={getValues('selectedSlots').includes(matchingSlot.dateTime) ? 'default' : 'outline'}
                                            className="w-[120px] h-[100px] flex flex-col items-center justify-center hover:-translate-y-1 p-2 shadow-lg"
                                            onClick={() => handleSlotClick(matchingSlot.dateTime)}
                                          >
                                            <span className="text-sm">{format(toZonedTime(parseISO(matchingSlot.dateTime), 'UTC'), 'dd/MM/yyyy')}</span>
                                            <div className="text-xs flex flex-col">
                                              <span>Duração</span>
                                              <span>{matchingSlot.duration}</span>
                                            </div>
                                            {matchingSlot.votes.length > 0 && (
                                              <span className="text-xs mb-1 bg-foreground text-white px-2 py-0.4 rounded-lg">
                                                {matchingSlot.votes.length} voto(s)
                                              </span>
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Clique para selecionar</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ) : (
                                      <div className="w-[120px] h-[80px] m-1"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </Card>
                <div className="space-y-4 py-8">
                  <div className="space-y-2">
                    <Label htmlFor="name">Seu Nome</Label>
                    <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Seu Email (opcional - para receber o resultado)</Label>
                    <Input id="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    Votar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <VotingPodium timeSlots={timeSlots} onShowVoters={handleShowVoters} />
        </div>
        <VotersDialog
          open={showVotersDialog}
          onClose={setShowVotersDialog}
          selectedSlotForVoters={timeSlots.find((slot) => slot.dateTime === getValues('selectedSlots')[0]) || null}
        />
      </TooltipProvider>
      <ShareDialog open={showShareDialog} onClose={setShowShareDialog} />
    </div>
  );
};

export default VotingRoom;
