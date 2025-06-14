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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Tag, X, User, List, Calendar, Paperclip, Share, Archive, Copy, Move, Image } from 'lucide-react';
import { BoardCard, Label as LabelType, Checklist, Member } from '../config';
import { LabelManager } from './LabelManager';
import { ChecklistManager } from './ChecklistManager';
import { DatePicker } from './DatePicker';
import { CoverImageSelector } from './CoverImageSelector';
import { MemberManager } from './MemberManager';
import { DescriptionEditor } from './DescriptionEditor';

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
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const handleAddLabel = (label: LabelType) => {
    onUpdateCard(card.id, {
      labels: [...(card.labels || []), label]
    });
  };

  const handleRemoveLabel = (labelId: string) => {
    onUpdateCard(card.id, {
      labels: card.labels?.filter(label => label.id !== labelId) || []
    });
  };

  const handleUpdateChecklists = (checklists: Checklist[]) => {
    onUpdateCard(card.id, { checklists });
  };

  const handleDateChange = (date: string | undefined) => {
    onUpdateCard(card.id, { dueDate: date });
  };

  const handleCoverImageChange = (url: string | undefined) => {
    onUpdateCard(card.id, { coverImage: url });
  };

  const handleAddMember = (member: Member) => {
    onUpdateCard(card.id, {
      members: [...(card.members || []), member]
    });
  };

  const handleRemoveMember = (memberId: string) => {
    onUpdateCard(card.id, {
      members: card.members?.filter(member => member.id !== memberId) || []
    });
  };

  const sidebarActions = [
    { 
      icon: User, 
      label: 'Membros', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'members' ? null : 'members'),
      key: 'members'
    },
    { 
      icon: Tag, 
      label: 'Etiquetas', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'labels' ? null : 'labels'),
      key: 'labels'
    },
    { 
      icon: List, 
      label: 'Checklist', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'checklist' ? null : 'checklist'),
      key: 'checklist'
    },
    { 
      icon: Calendar, 
      label: 'Datas', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'dates' ? null : 'dates'),
      key: 'dates'
    },
    { 
      icon: Paperclip, 
      label: 'Anexo', 
      section: 'add', 
      action: () => console.log('Anexo'),
      key: 'attachment'
    },
    { 
      icon: Image, 
      label: 'Capa', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'cover' ? null : 'cover'),
      key: 'cover'
    },
    { 
      icon: Move, 
      label: 'Mover', 
      section: 'actions', 
      action: () => console.log('Mover'),
      key: 'move'
    },
    { 
      icon: Copy, 
      label: 'Copiar', 
      section: 'actions', 
      action: () => console.log('Copiar'),
      key: 'copy'
    },
    { 
      icon: Archive, 
      label: 'Arquivar', 
      section: 'actions', 
      action: () => console.log('Arquivar'),
      key: 'archive'
    },
    { 
      icon: Share, 
      label: 'Compartilhar', 
      section: 'actions', 
      action: () => console.log('Compartilhar'),
      key: 'share'
    },
  ];

  const addActions = sidebarActions.filter(action => action.section === 'add');
  const actionsList = sidebarActions.filter(action => action.section === 'actions');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
        <div className="flex h-full min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {card.coverImage && (
              <div className="flex-shrink-0">
                <img
                  src={card.coverImage}
                  alt="Capa do card"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto min-h-0">
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
                  <DescriptionEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Adicione uma descrição mais detalhada..."
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

                {/* Members Display */}
                {card.members && card.members.length > 0 && (
                  <div className="space-y-2">
                    <Label>Membros</Label>
                    <div className="flex flex-wrap gap-2">
                      {card.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded-lg">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labels Display */}
                {card.labels && card.labels.length > 0 && (
                  <div className="space-y-2">
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2">
                      {card.labels.map((label) => (
                        <Badge 
                          key={label.id}
                          style={{ backgroundColor: label.color, color: 'white' }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {card.tags && card.tags.length > 0 && (
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
                )}

                {/* Checklists Display */}
                {card.checklists && card.checklists.length > 0 && (
                  <div className="space-y-2">
                    <Label>Checklists</Label>
                    <ChecklistManager
                      checklists={card.checklists}
                      onUpdateChecklists={handleUpdateChecklists}
                    />
                  </div>
                )}

                {/* Due Date Display */}
                {card.dueDate && (
                  <div className="space-y-2">
                    <Label>Data de vencimento</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="space-y-4 border-t pt-6">
                  <Label className="text-base font-semibold">Atividade</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Escrever um comentário</Label>
                    <div className="flex gap-2">
                      <DescriptionEditor
                        value={comment}
                        onChange={setComment}
                        placeholder="Escrever um comentário..."
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
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-muted/30 border-l flex flex-col">
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Adicionar ao card
                </Label>
                {addActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={activeSection === action.key ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start text-sm h-9 transition-colors ${
                      activeSection === action.key 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={action.action}
                  >
                    <action.icon className="h-4 w-4 mr-3" />
                    {action.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
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

              {/* Active Section Content */}
              {activeSection === 'members' && (
                <div className="space-y-2 p-3 border rounded-lg bg-background">
                  <h4 className="font-medium">Membros</h4>
                  <MemberManager
                    members={card.members || []}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                  />
                </div>
              )}

              {activeSection === 'labels' && (
                <div className="space-y-2 p-3 border rounded-lg bg-background">
                  <h4 className="font-medium">Etiquetas</h4>
                  <LabelManager
                    labels={card.labels || []}
                    onAddLabel={handleAddLabel}
                    onRemoveLabel={handleRemoveLabel}
                  />
                </div>
              )}

              {activeSection === 'checklist' && (
                <div className="space-y-2 p-3 border rounded-lg bg-background">
                  <h4 className="font-medium">Checklist</h4>
                  <ChecklistManager
                    checklists={card.checklists || []}
                    onUpdateChecklists={handleUpdateChecklists}
                  />
                </div>
              )}

              {activeSection === 'dates' && (
                <div className="space-y-2 p-3 border rounded-lg bg-background">
                  <h4 className="font-medium">Datas</h4>
                  <DatePicker
                    date={card.dueDate}
                    onDateChange={handleDateChange}
                  />
                </div>
              )}

              {activeSection === 'cover' && (
                <div className="space-y-2 p-3 border rounded-lg bg-background">
                  <h4 className="font-medium">Capa</h4>
                  <CoverImageSelector
                    coverImage={card.coverImage}
                    onImageChange={handleCoverImageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
