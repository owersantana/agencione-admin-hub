
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Mail, Link } from 'lucide-react';
import { Board } from '../config';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board | null;
}

export function ShareBoardModal({ isOpen, onClose, board }: ShareBoardModalProps) {
  const [emails, setEmails] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  React.useEffect(() => {
    if (board && isOpen) {
      setLinkCopied(false);
    }
  }, [board, isOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const sendByEmail = () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    if (emailList.length > 0) {
      console.log('Enviando convites para:', emailList);
      // TODO: Implement email sending
      onClose();
    }
  };

  if (!board) return null;

  const shareLink = `${window.location.origin}/board/${board.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhar Board: {board.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>Link de Compartilhamento</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shareLink)}
                  className="flex items-center gap-2"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {linkCopied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Emails para Convite</Label>
              <Textarea
                id="emails"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Digite os emails separados por vírgula&#10;exemplo: user1@email.com, user2@email.com"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Separe múltiplos emails com vírgula
              </p>
            </div>
            
            <Button 
              onClick={sendByEmail}
              className="w-full flex items-center gap-2"
              disabled={!emails.trim()}
            >
              <Mail className="h-4 w-4" />
              Enviar Convites
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
