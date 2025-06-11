
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Tag, X } from 'lucide-react';
import { BoardCard } from '../config';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: BoardCard | null;
  onUpdateCard: (cardId: string, updates: Partial<BoardCard>) => void;
}

export function CardDetailModal({ isOpen, onClose, card, onUpdateCard }: CardDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');

  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    onUpdateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !card.tags?.includes(newTag.trim())) {
      onUpdateCard(card.id, {
        tags: [...(card.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdateCard(card.id, {
      tags: card.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const setPriority = (priority: 'low' | 'medium' | 'high') => {
    onUpdateCard(card.id, { priority });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="card-title">Título</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do card"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="card-description">Descrição</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do card"
              rows={4}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <Button
                  key={priority}
                  variant={card.priority === priority ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(priority as 'low' | 'medium' | 'high')}
                >
                  {priority === 'low' && 'Baixa'}
                  {priority === 'medium' && 'Média'}
                  {priority === 'high' && 'Alta'}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {card.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button onClick={addTag} size="sm">
                Adicionar
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Criado em {new Date(card.createdAt).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Atualizado em {new Date(card.updatedAt).toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
