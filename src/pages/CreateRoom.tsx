import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, CalendarCheck, Trash2, X, CirclePlus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { postRoom } from '@/services/RoomService';
import { newRoomSchema } from '@/schemas/roomSchema';

const CreateRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialName = location.state?.name || '';

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newRoomSchema),
    defaultValues: {
      name: initialName,
      title: '',
      description: '',
      endDate: undefined,
      endTime: undefined,
      selectedDates: [],
    },
  });

  const selectedDates = watch('selectedDates');
  watch('endDate');

  const handleDateSelect = (date: Date) => {
    if (!date || selectedDates.some((slot) => slot.date.getTime() === date.getTime())) {
      toast.warning('Data já selecionada');
      return;
    }

    setValue('selectedDates', [...selectedDates, { date, times: [{ start: '07:00', duration: '00:30' }] }], { shouldDirty: true, shouldTouch: true });
  };

  const removeDateSlot = useCallback(
    (dateIndex: number) => {
      setValue(
        'selectedDates',
        selectedDates.filter((_, index) => index !== dateIndex),
        { shouldDirty: true, shouldTouch: true }
      );
    },
    [selectedDates, setValue]
  );

  const addTimeSlot = useCallback(
    (dateIndex: number) => {
      setValue(
        'selectedDates',
        selectedDates.map((slot, index) => (index === dateIndex ? { ...slot, times: [...slot.times, { start: '09:00', duration: '01:00' }] } : slot)),
        { shouldDirty: true, shouldTouch: true }
      );
    },
    [selectedDates, setValue]
  );

  const removeTimeSlot = useCallback(
    (dateIndex: number, timeIndex: number) => {
      setValue(
        'selectedDates',
        selectedDates
          .map((slot, index) => (index === dateIndex ? { ...slot, times: slot.times.filter((_, i) => i !== timeIndex) } : slot))
          .filter((slot) => slot.times.length > 0),
        { shouldDirty: true, shouldTouch: true }
      );
    },
    [selectedDates, setValue]
  );

  const updateTimeSlot = (dateIndex: number, timeIndex: number, field: 'start' | 'duration', value: string) => {
    setValue(
      'selectedDates',
      selectedDates.map((slot, index) =>
        index === dateIndex
          ? {
              ...slot,
              times: slot.times.map((time, i) => (i === timeIndex ? { ...time, [field]: value } : time)),
            }
          : slot
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      const roomIdPromise = postRoom(data);

      toast.promise(roomIdPromise, {
        loading: 'Criando sala...',
        success: 'Sala criada com sucesso!',
        error: 'Erro ao criar sala',
      });

      const roomId = await roomIdPromise;

      navigate(`/sala-votacao/${roomId}`);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      toast.error('Erro ao criar sala');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <Link to={'/'}>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">MeetSync</span>
            </div>
          </Link>
        </header>

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Criar Nova Sala</h1>
          <p className="text-muted-foreground">Defina os detalhes da reunião e os horários disponíveis</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Informações da Reunião</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seu Nome</Label>
                  <Input {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Reunião</Label>
                  <Input {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea {...register('description')} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>Data e Hora Limite para Votação</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="min-w-[180px] w-full sm:w-3/4">
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecione a data'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} fromDate={new Date()} initialFocus locale={ptBR} />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {errors.endDate && <p className="text-red-500 text-xs pt-1">Selecione uma data limite</p>}
                    </div>

                    <div className="w-full sm:w-1/4">
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Horário" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 * 2 }).map((_, i) => {
                                const hour = Math.floor(i / 2);
                                const minute = i % 2 === 0 ? '00' : '30';
                                const time = `${String(hour).padStart(2, '0')}:${minute}`;
                                return (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.endTime && <p className="text-red-500 text-xs pt-1">Selecione uma hora limite</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Selecione as Datas</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center w-full h-max">
                <Controller
                  name="selectedDates"
                  control={control}
                  render={() => (
                    <Calendar
                      mode="single"
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      className="flex justify-center rounded-md border w-full h-full"
                      locale={ptBR}
                    />
                  )}
                />
              </CardContent>
              <CardFooter>{errors.selectedDates && <p className="text-red-500 text-xs pt-1">{errors.selectedDates.message as string}</p>}</CardFooter>
            </Card>
          </div>
          <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {selectedDates.map((dateSlot, dateIndex) => (
              <Card key={dateSlot.date.toISOString()} className="flex flex-col justify-center shadow-lg hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="px-4 pb-2 relative pt-4">
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeDateSlot(dateIndex)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <CardTitle className="flex flex-col text-sm">
                    <p>
                      {format(dateSlot.date, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    <span className="text-muted-foreground text-xs capitalize">{format(new Date(dateSlot.date), 'EEEE', { locale: ptBR })}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-2">
                  {dateSlot.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="flex items-center gap-2">
                      <Select value={time.start} onValueChange={(value) => updateTimeSlot(dateIndex, timeIndex, 'start', value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Início" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                              {`${String(i).padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={time.duration} onValueChange={(value) => updateTimeSlot(dateIndex, timeIndex, 'duration', value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Duração" />
                        </SelectTrigger>
                        <SelectContent>
                          {['00:00', '00:15', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '06:00'].map(
                            (duration) => (
                              <SelectItem key={duration} value={duration}>
                                {duration}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <Button type="button" variant="destructive" size="icon" onClick={() => removeTimeSlot(dateIndex, timeIndex)} className="rounded-sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addTimeSlot(dateIndex)} className="w-full text-sm text-muted-foreground">
                    <CirclePlus className="mr-2 h-3 w-3" />
                    Adicionar Horário
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Card>
          <div className="flex justify-end mt-8">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              Criar Sala
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
