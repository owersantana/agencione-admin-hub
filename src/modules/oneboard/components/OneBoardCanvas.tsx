
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { Board, BoardColumn, BoardCard } from '../config';
import { OneBoardColumn } from './OneBoardColumn';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

interface OneBoardCanvasProps {
  board: Board | null;
  onBoardUpdate: (board: Board) => void;
}

export function OneBoardCanvas({ board, onBoardUpdate }: OneBoardCanvasProps) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [activeColumn, setActiveColumn] = useState<BoardColumn | null>(null);
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    if (board) {
      // Start with empty columns
      setColumns([]);
    }
  }, [board]);

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um board para visualizar</p>
      </div>
    );
  }

  const addColumn = (title: string) => {
    const newColumn: BoardColumn = {
      id: crypto.randomUUID(),
      title,
      boardId: board.id,
      position: columns.length,
      cards: []
    };
    setColumns(prev => [...prev, newColumn]);
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

  const updateCard = (cardId: string, updates: Partial<BoardCard>) => {
    const column = columns.find(col => col.cards.some(card => card.id === cardId));
    if (!column) return;

    updateColumn(column.id, {
      cards: column.cards.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    });
  };

  const deleteCard = (cardId: string) => {
    const column = columns.find(col => col.cards.some(card => card.id === cardId));
    if (!column) return;

    updateColumn(column.id, {
      cards: column.cards.filter(card => card.id !== cardId)
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'column') {
      setActiveColumn(active.data.current.column);
    } else if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'card') {
      const activeCard = active.data.current?.card as BoardCard;
      
      if (overType === 'column') {
        // Moving card to empty column
        const overColumn = over.data.current?.column as BoardColumn;
        if (activeCard.columnId !== overColumn.id) {
          moveCardToColumn(activeCard.id, overColumn.id, 0);
        }
      } else if (overType === 'card') {
        // Moving card over another card
        const overCard = over.data.current?.card as BoardCard;
        if (activeCard.id !== overCard.id) {
          const overColumn = columns.find(col => col.id === overCard.columnId);
          if (overColumn) {
            const overIndex = overColumn.cards.findIndex(card => card.id === overCard.id);
            moveCardToColumn(activeCard.id, overColumn.id, overIndex);
          }
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    
    if (activeType === 'column') {
      const activeColumn = active.data.current?.column as BoardColumn;
      const overColumn = over.data.current?.column as BoardColumn;
      
      if (activeColumn.id !== overColumn.id) {
        const activeIndex = columns.findIndex(col => col.id === activeColumn.id);
        const overIndex = columns.findIndex(col => col.id === overColumn.id);
        
        const newColumns = [...columns];
        const [removed] = newColumns.splice(activeIndex, 1);
        newColumns.splice(overIndex, 0, removed);
        
        setColumns(newColumns.map((col, index) => ({ ...col, position: index })));
      }
    }

    setActiveColumn(null);
    setActiveCard(null);
  };

  const moveCardToColumn = (cardId: string, toColumnId: string, newPosition: number) => {
    const fromColumn = columns.find(col => col.cards.some(card => card.id === cardId));
    const toColumn = columns.find(col => col.id === toColumnId);
    
    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return;

    // Remove from source column
    updateColumn(fromColumn.id, {
      cards: fromColumn.cards.filter(c => c.id !== cardId)
    });

    // Add to target column
    const updatedCard = { ...card, columnId: toColumnId };
    const newCards = [...toColumn.cards];
    newCards.splice(newPosition, 0, updatedCard);
    
    updateColumn(toColumnId, {
      cards: newCards.map((c, index) => ({ ...c, position: index }))
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
      {/* Board Toolbar */}
      <div className="border-b border-border bg-background p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">{board.name}</h2>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={() => {
              const title = prompt('Nome da coluna:');
              if (title?.trim()) {
                addColumn(title.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Coluna</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-full gap-3 sm:gap-4 p-3 sm:p-4 min-w-max">
              <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
                {columns.map((column) => (
                  <OneBoardColumn
                    key={column.id}
                    column={column}
                    onUpdateColumn={updateColumn}
                    onDeleteColumn={deleteColumn}
                    onAddCard={addCard}
                    onUpdateCard={updateCard}
                    onDeleteCard={deleteCard}
                  />
                ))}
              </SortableContext>
            </div>

            <DragOverlay>
              {activeColumn && (
                <div className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80 opacity-50">
                  <OneBoardColumn
                    column={activeColumn}
                    onUpdateColumn={() => {}}
                    onDeleteColumn={() => {}}
                    onAddCard={() => {}}
                    onUpdateCard={() => {}}
                    onDeleteCard={() => {}}
                  />
                </div>
              )}
              {activeCard && (
                <div className="p-2 sm:p-3 bg-background border rounded-lg shadow-lg opacity-50">
                  <h4 className="text-sm font-medium">{activeCard.title}</h4>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
