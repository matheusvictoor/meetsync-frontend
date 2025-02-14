import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
  const { roomId } = useParams();
  const copyToClipboard = async (text: string, type: 'link' | 'id') => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type === 'link' ? 'Link' : 'ID'} copiado para a área de transferência.`);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sala de votação criada!</DialogTitle>
          <DialogDescription>Compartilhe o link ou ID da sala com os participantes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Link da sala</Label>
            <div className="flex space-x-2">
              <Input readOnly value={window.location.href} className="bg-muted" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(window.location.href, 'link')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>ID da sala</Label>
            <div className="flex space-x-2">
              <Input readOnly value={roomId} className="bg-muted" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(roomId!, 'id')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
