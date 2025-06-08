
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Board, Card } from '../config';
import { OneboardStage } from './OneboardStage';
import { useOneboardData } from '../hooks/useOneboardData';
import { Plus } from 'lucide-react';

interface OneboardCanvasProps {
  board: Board;
  onNewCard: () => void;
}

export function OneboardCanvas({ board, onNewCard }: OneboardCanvasProps) {
  const { addStage, addCard, moveCard, updateBoard } = useOneboardData();
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState('');

  const handleAddStage = () => {
    if (newStageTitle.trim()) {
      addStage(board.id, newStageTitle.trim());
      setNewStageTitle('');
      setIsAddingStage(false);
    }
  };

  const handleEditStage = (updatedStage: any) => {
    const updatedBoard = {
      ...board,
      stages: board.stages.map(stage =>
        stage.id === updatedStage.id ? updatedStage : stage
      ),
    };
    updateBoard(updatedBoard);
  };

  const handleEditCard = (card: Card) => {
    // Implementar modal de edição de card
    console.log('Editar card:', card);
  };

  const handleDeleteCard = (cardId: string) => {
    // Implementar exclusão de card
    console.log('Excluir card:', cardId);
  };

  // Ordenar stages por ordem
  const sortedStages = [...board.stages].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-6 p-6 pb-6 min-h-0">
        {sortedStages.map((stage) => (
          <OneboardStage
            key={stage.id}
            stage={stage}
            onAddCard={(stageId, title) => addCard(board.id, stageId, title)}
            onEditStage={handleEditStage}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
          />
        ))}

        {/* Add new stage */}
        <div className="w-80 flex-shrink-0">
          {isAddingStage ? (
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <Input
                placeholder="Digite o título da stage..."
                value={newStageTitle}
                onChange={(e) => setNewStageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddStage();
                  if (e.key === 'Escape') setIsAddingStage(false);
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddStage}>
                  Adicionar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAddingStage(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full h-12 border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              onClick={() => setIsAddingStage(true)}
            >
              <Plus size={16} className="mr-2" />
              Adicionar stage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
