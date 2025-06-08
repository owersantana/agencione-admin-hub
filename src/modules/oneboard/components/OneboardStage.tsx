
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OneboardCard } from './OneboardCard';
import { Stage, Card as BoardCard } from '../config';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OneboardStageProps {
  stage: Stage;
  onAddCard: (stageId: string, title: string, description?: string) => void;
  onEditStage: (stage: Stage) => void;
  onEditCard: (card: BoardCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export function OneboardStage({
  stage,
  onAddCard,
  onEditStage,
  onEditCard,
  onDeleteCard
}: OneboardStageProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(stage.title);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(stage.id, newCardTitle.trim(), newCardDescription.trim() || undefined);
      setNewCardTitle('');
      setNewCardDescription('');
      setIsAddingCard(false);
    }
  };

  const handleEditTitle = () => {
    if (editTitle.trim()) {
      onEditStage({ ...stage, title: editTitle.trim() });
    } else {
      setEditTitle(stage.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <Card className="w-80 flex-shrink-0 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditTitle();
                if (e.key === 'Escape') {
                  setEditTitle(stage.title);
                  setIsEditingTitle(false);
                }
              }}
              onBlur={handleEditTitle}
              className="h-8 text-sm font-medium"
              autoFocus
            />
          ) : (
            <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
          )}
          
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {stage.cards.length}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir stage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Cards */}
        {stage.cards.map((card) => (
          <OneboardCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}

        {/* Add new card */}
        {isAddingCard ? (
          <Card className="border-dashed">
            <CardContent className="p-3 space-y-2">
              <Input
                placeholder="Título do card..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Descrição (opcional)..."
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
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
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar card
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
