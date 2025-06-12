
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TRELLO_BOARD_TEMPLATES, createBoardFromTemplate } from '../data/trelloTemplates';
import { Board, BoardColumn } from '../config';
import { Kanban, Users, Megaphone } from 'lucide-react';

interface BoardTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: Board, columns: BoardColumn[]) => void;
}

export function BoardTemplateModal({ isOpen, onClose, onCreateBoard }: BoardTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [boardName, setBoardName] = useState('');
  const [step, setStep] = useState<'select' | 'customize'>('select');

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'template-personal-kanban':
        return <Kanban className="h-6 w-6" />;
      case 'template-project-management':
        return <Users className="h-6 w-6" />;
      case 'template-marketing':
        return <Megaphone className="h-6 w-6" />;
      default:
        return <Kanban className="h-6 w-6" />;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TRELLO_BOARD_TEMPLATES.find(t => t.id === templateId);
    setBoardName(template?.name || '');
    setStep('customize');
  };

  const handleCreateBoard = () => {
    if (!selectedTemplate || !boardName.trim()) return;

    try {
      const { board, columns } = createBoardFromTemplate(selectedTemplate, boardName.trim());
      onCreateBoard(board, columns);
      onClose();
      resetModal();
    } catch (error) {
      console.error('Erro ao criar board:', error);
    }
  };

  const resetModal = () => {
    setSelectedTemplate(null);
    setBoardName('');
    setStep('select');
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Escolher Template' : 'Personalizar Board'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Selecione um template baseado no Trello para começar rapidamente'
              : 'Customize seu novo board baseado no template selecionado'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRELLO_BOARD_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {getTemplateIcon(template.id)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {template.description}
                    </CardDescription>
                    <Badge variant="secondary">
                      {template.columnsCount} colunas
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={() => setStep('customize')}>
                Criar Board Vazio
              </Button>
            </div>
          </div>
        )}

        {step === 'customize' && (
          <div className="space-y-6">
            {selectedTemplate && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {getTemplateIcon(selectedTemplate)}
                  <h3 className="font-semibold">
                    {TRELLO_BOARD_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {TRELLO_BOARD_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="board-name">Nome do Board</Label>
              <Input
                id="board-name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Digite o nome do seu board"
                autoFocus
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('select')}>
                Voltar
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateBoard}
                  disabled={!boardName.trim()}
                >
                  Criar Board
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
