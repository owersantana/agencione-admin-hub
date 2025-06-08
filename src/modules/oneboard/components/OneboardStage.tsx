
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stage, Card } from '../config';
import { OneboardCard } from './OneboardCard';
import { Plus, MoreHorizontal, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface OneboardStageProps {
  stage: Stage;
  onAddCard?: (stageId: string, title: string) => void;
  onEditStage?: (stage: Stage) => void;
  onEditCard?: (card: Card) => void;
  onDeleteCard?: (cardId: string) => void;
  onDrop?: (stageId: string, index: number) => void;
}

export function OneboardStage({
  stage,
  onAddCard,
  onEditStage,
  onEditCard,
  onDeleteCard,
  onDrop
}: OneboardStageProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(stage.title);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard?.(stage.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleTitleSubmit = () => {
    if (editingTitle.trim() && editingTitle !== stage.title) {
      onEditStage?.({ ...stage, title: editingTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(stage.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="w-80 flex-shrink-0 bg-muted/30 rounded-lg p-4">
      {/* Stage header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          {isEditingTitle ? (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') handleTitleCancel();
              }}
              onBlur={handleTitleSubmit}
              className="text-sm font-medium h-8"
              autoFocus
            />
          ) : (
            <>
              <h3 
                className="text-sm font-medium text-foreground cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                {stage.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {stage.cards.length}
              </Badge>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Edit2 size={14} className="mr-2" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Excluir stage
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <div className="space-y-3 min-h-24">
        {stage.cards.map((card) => (
          <OneboardCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}

        {/* Add card form */}
        {isAddingCard ? (
          <div className="space-y-2 p-3 bg-background rounded-lg border">
            <Input
              placeholder="Digite o título do card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCard();
                if (e.key === 'Escape') setIsAddingCard(false);
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Adicionar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsAddingCard(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full h-10 border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar card
          </Button>
        )}
      </div>
    </div>
  );
}
