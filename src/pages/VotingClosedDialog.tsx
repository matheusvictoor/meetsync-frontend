import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface VotingClosedDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function VotingClosedDialog({ open, onClose }: VotingClosedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center pb-4">⚠️ Votação Encerrada</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            As votações nesta sala foram encerradas! <br/> Confira o pódio e veja os horários mais bem votados. 🏆
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
