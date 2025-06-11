
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Board, BoardColumn, BoardCard } from '../config';
import { OneBoardColumn } from './OneBoardColumn';

interface OneBoardCanvasProps {
  board: Board | null;
  onBoardUpdate: (board: Board) => void;
}

export function OneBoardCanvas({ board, onBoardUpdate }: OneBoardCanvasProps) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);

  useEffect(() => {
    if (board) {
      // Initialize with default columns if none exist
      const defaultColumns: BoardColumn[] = [
        {
          id: crypto.randomUUID(),
          title: 'A Fazer',
          boardId: board.id,
          position: 0,
          cards: []
        },
        {
          id: crypto.randomUUID(),
          title: 'Em Progresso',
          boardId: board.id,
          position: 1,
          cards: []
        },
        {
          id: crypto.randomUUID(),
          title: 'Concluído',
          boardId: board.id,
          position: 2,
          cards: []
        }
      ];
      setColumns(defaultColumns);
    }
  }, [board]);

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um board para visualizar</p>
      </div>
    );
  }

  const addColumn = () => {
    const newColumn: BoardColumn = {
      id: crypto.randomUUID(),
      title: 'Nova Coluna',
      boardId: board.id,
      position: columns.length,
      cards: []
    };
    setColumns(prev => [...prev, newColumn]);
    
    // Update board columns count
    onBoardUpdate({ ...board, columnsCount: columns.length + 1 });
  };

  const updateColumn = (columnId: string, updates: Partial<BoardColumn>) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const deleteColumn = (columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    onBoardUpdate({ ...board, columnsCount: columns.length - 1 });
  };

  const addCard = (columnId: string, title: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newCard: BoardCard = {
      id: crypto.randomUUID(),
      title,
      columnId,
      position: column.cards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateColumn(columnId, {
      cards: [...column.cards, newCard]
    });
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newPosition: number) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const toColumn = columns.find(col => col.id === toColumnId);
    
    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return;

    // Remove card from source column
    updateColumn(fromColumnId, {
      cards: fromColumn.cards.filter(c => c.id !== cardId)
    });

    // Add card to target column
    const updatedCard = { ...card, columnId: toColumnId, position: newPosition };
    const newCards = [...toColumn.cards];
    newCards.splice(newPosition, 0, updatedCard);
    
    updateColumn(toColumnId, {
      cards: newCards.map((c, index) => ({ ...c, position: index }))
    });
  };

  return (
    <div className="flex-1 overflow-hidden bg-muted/20">
      <div className="h-full overflow-x-auto">
        <div className="flex h-full gap-4 p-4 min-w-max">
          {columns.map((column) => (
            <OneBoardColumn
              key={column.id}
              column={column}
              onUpdateColumn={updateColumn}
              onDeleteColumn={deleteColumn}
              onAddCard={addCard}
              onMoveCard={moveCard}
            />
          ))}
          
          <div className="min-w-80">
            <Button
              variant="outline"
              onClick={addColumn}
              className="w-full h-12 border-dashed text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Coluna
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
