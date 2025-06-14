
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
import { CalendarDays, Tag, X, User, List, Calendar, Paperclip, Share, Archive, Copy, Move } from 'lucide-react';
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
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, createdAt: string}>>([]);

  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setComments(card.comments || []);
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    onUpdateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
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

  const setPriority = (priority: 'low' | 'medium' | 'high' | undefined) => {
    onUpdateCard(card.id, { priority });
  };

  const getPriorityText = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return 'Nenhuma';
    }
  };

  const addComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: crypto.randomUUID(),
        text: comment.trim(),
        author: 'Usuário',
        createdAt: new Date().toISOString()
      };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      onUpdateCard(card.id, { comments: updatedComments });
      setComment('');
    }
  };

  const sidebarActions = [
    { icon: User, label: 'Membros', section: 'add', action: () => console.log('Membros') },
    { icon: Tag, label: 'Etiquetas', section: 'add', action: () => console.log('Etiquetas') },
    { icon: List, label: 'Checklist', section: 'add', action: () => console.log('Checklist') },
    { icon: Calendar, label: 'Datas', section: 'add', action: () => console.log('Datas') },
    { icon: Paperclip, label: 'Anexo', section: 'add', action: () => console.log('Anexo') },
    { icon: Tag, label: 'Capa', section: 'add', action: () => console.log('Capa') },
    { icon: Move, label: 'Mover', section: 'actions', action: () => console.log('Mover') },
    { icon: Copy, label: 'Copiar', section: 'actions', action: () => console.log('Copiar') },
    { icon: Archive, label: 'Arquivar', section: 'actions', action: () => console.log('Arquivar') },
    { icon: Share, label: 'Compartilhar', section: 'actions', action: () => console.log('Compartilhar') },
  ];

  const addActions = sidebarActions.filter(action => action.section === 'add');
  const actionsList = sidebarActions.filter(action => action.section === 'actions');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">{card.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="card-title">Título</Label>
                <Input
                  id="card-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do card"
                />
              </div>

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

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={!card.priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriority(undefined)}
                  >
                    Nenhuma
                  </Button>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Button
                      key={priority}
                      variant={card.priority === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPriority(priority)}
                    >
                      {getPriorityText(priority)}
                    </Button>
                  ))}
                </div>
              </div>

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

              {/* Comments Section */}
              <div className="space-y-4 border-t pt-6">
                <Label className="text-base font-semibold">Atividade</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="comment">Escrever um comentário</Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escrever um comentário..."
                      rows={3}
                      className="flex-1"
                    />
                  </div>
                  <Button onClick={addComment} size="sm" disabled={!comment.trim()}>
                    Comentar
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.map((commentItem) => (
                    <div key={commentItem.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{commentItem.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(commentItem.createdAt).toLocaleDateString('pt-BR')} às {new Date(commentItem.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{commentItem.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Criado em {new Date(card.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Atualizado em {new Date(card.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-52 bg-muted/30 border-l p-4 overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Adicionar ao card
              </Label>
              {addActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-9 bg-background hover:bg-muted transition-colors"
                  onClick={action.action}
                >
                  <action.icon className="h-4 w-4 mr-3" />
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="space-y-2 mt-6">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Ações
              </Label>
              {actionsList.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-9 bg-background hover:bg-muted transition-colors"
                  onClick={action.action}
                >
                  <action.icon className="h-4 w-4 mr-3" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
