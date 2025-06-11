
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit } from 'lucide-react';
import { BoardColumn, BoardCard } from '../config';

interface OneBoardColumnProps {
  column: BoardColumn;
  onUpdateColumn: (columnId: string, updates: Partial<BoardColumn>) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, newPosition: number) => void;
}

export function OneBoardColumn({
  column,
  onUpdateColumn,
  onDeleteColumn,
  onAddCard
}: OneBoardColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

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
    <div className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
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
                className="font-semibold text-sm cursor-pointer hover:text-muted-foreground truncate"
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
          {column.cards.map((card) => (
            <Card key={card.id} className="p-2 sm:p-3 cursor-pointer hover:shadow-sm">
              <div className="space-y-2">
                <h4 className="text-sm font-medium line-clamp-2">{card.title}</h4>
                {card.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {card.description}
                  </p>
                )}
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}

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
              className="w-full justify-start text-muted-foreground border-dashed border text-sm"
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
