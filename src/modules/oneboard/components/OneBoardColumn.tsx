
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { BoardColumn, BoardCard } from '../config';
import { CardDetailModal } from './CardDetailModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SortableCardProps {
  card: BoardCard;
  onUpdateCard: (cardId: string, updates: Partial<BoardCard>) => void;
  onDeleteCard: (cardId: string) => void;
}

function SortableCard({ card, onUpdateCard, onDeleteCard }: SortableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim() && editTitle !== card.title) {
      onUpdateCard(card.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSingleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsDetailModalOpen(true);
    }
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  };

  return (
    <>
      <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-2 sm:p-3 cursor-pointer hover:shadow-sm transition-shadow group"
        onClick={handleSingleClick}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setEditTitle(card.title);
                    setIsEditing(false);
                  }
                }}
                className="text-sm font-medium"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 
                className="text-sm font-medium line-clamp-2 flex-1"
                onDoubleClick={handleDoubleClick}
              >
                {card.title}
              </h4>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}>
                  <Edit className="h-3 w-3 mr-2" />
                  Editar título
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailModalOpen(true);
                }}>
                  <Edit className="h-3 w-3 mr-2" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(card.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {card.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {card.priority && (
              <Badge variant={getPriorityColor(card.priority)} className="text-xs">
                {getPriorityText(card.priority)}
              </Badge>
            )}
            
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{card.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        card={card}
        onUpdateCard={onUpdateCard}
      />
    </>
  );
}

interface OneBoardColumnProps {
  column: BoardColumn;
  onUpdateColumn: (columnId: string, updates: Partial<BoardColumn>) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<BoardCard>) => void;
  onDeleteCard: (cardId: string) => void;
}

export function OneBoardColumn({
  column,
  onUpdateColumn,
  onDeleteColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard
}: OneBoardColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSubmit = () => {
    if (titleValue.trim()) {
      onUpdateColumn(column.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80 flex flex-col"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3" {...listeners}>
          <div className="flex items-center justify-between">
            {isEditingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleValue(column.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="h-8 font-semibold text-sm"
                autoFocus
              />
            ) : (
              <h3 
                className="font-semibold text-sm cursor-pointer hover:text-muted-foreground truncate flex-1"
                onClick={() => setIsEditingTitle(true)}
              >
                {column.title}
              </h3>
            )}
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingTitle(true)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteColumn(column.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-2 overflow-y-auto">
          <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            {column.cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
          </SortableContext>

          {isAddingCard ? (
            <div className="space-y-2">
              <Input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Digite o título do card"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCard();
                  if (e.key === 'Escape') {
                    setNewCardTitle('');
                    setIsAddingCard(false);
                  }
                }}
                className="text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCard} className="text-xs">
                  Adicionar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setNewCardTitle('');
                    setIsAddingCard(false);
                  }}
                  className="text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAddingCard(true)}
              className="w-full justify-start text-muted-foreground border-dashed border text-sm hover:border-primary/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar card
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
