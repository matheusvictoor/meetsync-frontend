import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Vote {
  name: string;
  email?: string;
}

interface TimeSlot {
  dateTime: string;
  votes: Vote[];
}

interface VotersDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  selectedSlotForVoters?: TimeSlot | null;
}

const VotersDialog = ({ open, onClose, selectedSlotForVoters }: VotersDialogProps) => {
  const [searchVoter, setSearchVoter] = useState('');

  const filteredVoters = selectedSlotForVoters?.votes.filter((vote) => vote.name.toLowerCase().includes(searchVoter.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Votantes</DialogTitle>
          <DialogDescription>
            {selectedSlotForVoters && (
              <>
                Data: {format(new Date(selectedSlotForVoters.dateTime), 'dd/MM/yyyy')}
                <br />
                Horário: {format(new Date(selectedSlotForVoters.dateTime), 'HH:mm')}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar votante..." value={searchVoter} onChange={(e) => setSearchVoter(e.target.value)} className="pl-8" />
        </div>
        <ScrollArea className="h-[200px] w-full pr-4">
          {filteredVoters?.map((vote, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span>{vote.name}</span>
              {vote.email && <span className="text-sm text-muted-foreground">{vote.email}</span>}
            </div>
          ))}
        </ScrollArea>
        <DialogClose asChild>
          <Button variant="default">Fechar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default VotersDialog;
