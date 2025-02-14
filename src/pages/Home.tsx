import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Users, Clock, CalendarCheck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FieldValues, useForm } from 'react-hook-form';
import { createRoomSchema, joinRoomSchema } from '@/schemas/homeSchema';

const Index = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const {
    register: registerCreateRoom,
    handleSubmit: handleSubmitCreateRoom,
    formState: { errors: errorsCreateRoom },
  } = useForm({ resolver: zodResolver(createRoomSchema) });

  const {
    register: registerJoinRoom,
    handleSubmit: handleSubmitJoinRoom,
    formState: { errors: errorsJoinRoom },
  } = useForm({ resolver: zodResolver(joinRoomSchema) });

  const onCreateRoom = (data: FieldValues) => {
    navigate('/criar-sala', { state: { name: data.name } });
  };

  const onJoinRoom = (data: FieldValues) => {
    if (!data.roomId) return;
    navigate(`/sala-votacao/${data.roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-4 animate-fade-in">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-auto mr-4 cursor-pointer" onClick={() => setShowInfo(true)} />
              </TooltipTrigger>
              <TooltipContent>Sobre o MeetSync</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center space-x-6 justify-center max-w-full">
            <CalendarCheck className="w-14 h-14" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight pb-2">MeetSync</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simplifique o agendamento de reuniões em grupo. Encontre o horário perfeito para todos se reunirem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 animate-slide-up">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Calendar className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Escolha Datas</h3>
              <p className="text-muted-foreground">Selecione múltiplas datas e horários para sua reunião</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Vote em Grupo</h3>
              <p className="text-muted-foreground">Compartilhe o link e vote nos melhores horários</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Clock className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Decida Rápido</h3>
              <p className="text-muted-foreground">Veja resultados em tempo real e tome decisões</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-md mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <TooltipProvider>
              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSubmitCreateRoom(onCreateRoom)} className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input type="text" placeholder="Seu nome" {...registerCreateRoom('name')} className="bg-background/50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Insira seu nome</p>
                    </TooltipContent>
                  </Tooltip>
                  {errorsCreateRoom.name && <p className="text-red-500 text-xs ml-2">{errorsCreateRoom.name?.message as string}</p>}
                  <Button type="submit" className="w-full" size="lg">
                    Criar Nova Sala
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou entre em uma sala existente</span>
                  </div>
                </div>
                <form onSubmit={handleSubmitJoinRoom(onJoinRoom)}>
                  <div className="flex flex-col">
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input placeholder="ID da sala" {...registerJoinRoom('roomId')} className="bg-background/50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insira um ID de uma sala existente</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button type="submit" variant="secondary">
                        Entrar
                      </Button>
                    </div>
                    {errorsJoinRoom.roomId && <p className="text-red-500 text-xs ml-2 pt-1">{errorsJoinRoom.roomId.message as string}</p>}
                  </div>
                </form>
              </CardContent>
            </TooltipProvider>
          </Card>
        </div>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-4">Sobre o MeetSync</DialogTitle>
            <DialogDescription>
              MeetSync é uma ferramenta moderna para ajudar grupos a encontrarem o melhor horário para suas reuniões. Crie uma sala, selecione possíveis datas e
              horários, compartilhe o link e deixe que todos votem em suas disponibilidades.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
