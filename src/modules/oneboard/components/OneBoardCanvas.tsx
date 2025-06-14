import React, { useState, useEffect } from 'react';
import { Board, BoardColumn, BoardCard } from '../config';
import { OneBoardColumn } from './OneBoardColumn';
import { OneBoardCanvasToolbar } from './OneBoardCanvasToolbar';
import { CreateColumnInline } from './CreateColumnInline';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

interface OneBoardCanvasProps {
  board: Board | null;
  onBoardUpdate: (board: Board) => void;
  onBoardAction?: (boardId: string, action: string) => void;
  initialColumns?: BoardColumn[];
}

export function OneBoardCanvas({ board, onBoardUpdate, onBoardAction, initialColumns }: OneBoardCanvasProps) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [activeColumn, setActiveColumn] = useState<BoardColumn | null>(null);
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Função para salvar colunas no localStorage
  const saveColumnsToStorage = (boardId: string, columnsToSave: BoardColumn[]) => {
    console.log('Saving columns to storage:', columnsToSave);
    localStorage.setItem(`board-columns-${boardId}`, JSON.stringify(columnsToSave));
  };

  useEffect(() => {
    if (board) {
      console.log('Loading board:', board.id);
      const savedColumns = localStorage.getItem(`board-columns-${board.id}`);
      
      if (savedColumns) {
        try {
          const parsedColumns = JSON.parse(savedColumns);
          console.log('Loaded columns from storage:', parsedColumns);
          setColumns(parsedColumns);
        } catch (error) {
          console.error('Error parsing saved columns:', error);
          if (initialColumns && initialColumns.length > 0) {
            const boardColumns = initialColumns.map(col => ({
              ...col,
              boardId: board.id
            }));
            setColumns(boardColumns);
            saveColumnsToStorage(board.id, boardColumns);
          } else {
            setColumns([]);
          }
        }
      } else {
        if (initialColumns && initialColumns.length > 0) {
          const boardColumns = initialColumns.map(col => ({
            ...col,
            boardId: board.id
          }));
          setColumns(boardColumns);
          saveColumnsToStorage(board.id, boardColumns);
        } else {
          setColumns([]);
        }
      }
    }
  }, [board, initialColumns]);

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um board para visualizar</p>
      </div>
    );
  }

  const addColumn = (title: string) => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da coluna não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const newColumn: BoardColumn = {
      id: crypto.randomUUID(),
      title: title.trim(),
      boardId: board.id,
      position: columns.length,
      cards: []
    };
    
    const newColumns = [...columns, newColumn];
    console.log('Adding new column:', newColumn);
    console.log('New columns array:', newColumns);
    
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
    onBoardUpdate({ ...board, columnsCount: newColumns.length, updatedAt: new Date().toISOString() });
    
    toast({
      title: "Sucesso",
      description: `Coluna "${title}" criada com sucesso`
    });
  };

  const updateColumn = (columnId: string, updates: Partial<BoardColumn>) => {
    const newColumns = columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    );
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter(col => col.id !== columnId);
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
    onBoardUpdate({ ...board, columnsCount: newColumns.length, updatedAt: new Date().toISOString() });
    
    toast({
      title: "Sucesso",
      description: "Coluna removida com sucesso"
    });
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
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
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

  const moveCard = (cardId: string, targetColumnId: string, position: number) => {
    const fromColumn = columns.find(col => col.cards.some(card => card.id === cardId));
    const toColumn = columns.find(col => col.id === targetColumnId);
    
    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return;

    // Update card's column reference
    const updatedCard = { ...card, columnId: targetColumnId };

    // If it's the same column, just reorder
    if (fromColumn.id === targetColumnId) {
      const newCards = [...fromColumn.cards];
      const cardIndex = newCards.findIndex(c => c.id === cardId);
      const [removedCard] = newCards.splice(cardIndex, 1);
      newCards.splice(position, 0, removedCard);
      
      updateColumn(fromColumn.id, {
        cards: newCards.map((c, index) => ({ ...c, position: index }))
      });
    } else {
      // Move to different column
      const newColumns = columns.map(col => {
        if (col.id === fromColumn.id) {
          // Remove from source column
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId).map((c, index) => ({ ...c, position: index }))
          };
        } else if (col.id === targetColumnId) {
          // Add to target column
          const newCards = [...col.cards];
          newCards.splice(position, 0, updatedCard);
          return {
            ...col,
            cards: newCards.map((c, index) => ({ ...c, position: index }))
          };
        }
        return col;
      });
      
      setColumns(newColumns);
      saveColumnsToStorage(board.id, newColumns);
    }
  };

  const copyCard = (originalCard: BoardCard, targetColumnId: string, position: number, newTitle: string, copyOptions: any) => {
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newCard: BoardCard = {
      id: crypto.randomUUID(),
      title: newTitle,
      columnId: targetColumnId,
      position: position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: copyOptions.copyDescription ? originalCard.description : undefined,
      labels: copyOptions.copyLabels ? originalCard.labels : undefined,
      members: copyOptions.copyMembers ? originalCard.members : undefined,
      checklists: copyOptions.copyChecklists ? originalCard.checklists : undefined,
      attachments: copyOptions.copyAttachments ? originalCard.attachments : undefined,
      dueDate: copyOptions.copyDueDate ? originalCard.dueDate : undefined,
      priority: originalCard.priority,
      tags: originalCard.tags,
    };

    // Insert card at specified position
    const newCards = [...targetColumn.cards];
    newCards.splice(position, 0, newCard);
    
    updateColumn(targetColumnId, {
      cards: newCards.map((c, index) => ({ ...c, position: index }))
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
        const overColumn = over.data.current?.column as BoardColumn;
        if (activeCard.columnId !== overColumn.id) {
          moveCardToColumn(activeCard.id, overColumn.id, overColumn.cards.length);
        }
      } else if (overType === 'card') {
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
    
    if (active.data.current?.type === 'column' && over) {
      const activeColumnId = active.id as string;
      const overColumnId = over.id as string;
      
      if (activeColumnId !== overColumnId) {
        const activeIndex = columns.findIndex(col => col.id === activeColumnId);
        const overIndex = columns.findIndex(col => col.id === overColumnId);
        
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        const reorderedColumns = newColumns.map((col, index) => ({ ...col, position: index }));
        setColumns(reorderedColumns);
        saveColumnsToStorage(board.id, reorderedColumns);
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

    if (fromColumn.id === toColumnId) {
      const newCards = [...fromColumn.cards];
      const cardIndex = newCards.findIndex(c => c.id === cardId);
      const [removedCard] = newCards.splice(cardIndex, 1);
      newCards.splice(newPosition, 0, removedCard);
      
      const newColumns = columns.map(col => 
        col.id === fromColumn.id 
          ? { ...col, cards: newCards.map((c, index) => ({ ...c, position: index })) }
          : col
      );
      
      setColumns(newColumns);
      saveColumnsToStorage(board.id, newColumns);
    } else {
      const updatedCard = { ...card, columnId: toColumnId };
      
      const newColumns = columns.map(col => {
        if (col.id === fromColumn.id) {
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId).map((c, index) => ({ ...c, position: index }))
          };
        } else if (col.id === toColumnId) {
          const newCards = [...col.cards];
          newCards.splice(newPosition, 0, updatedCard);
          return {
            ...col,
            cards: newCards.map((c, index) => ({ ...c, position: index }))
          };
        }
        return col;
      });
      
      setColumns(newColumns);
      saveColumnsToStorage(board.id, newColumns);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
      {/* Fixed Toolbar */}
      <div className="flex-shrink-0 sticky top-0 z-10">
        <OneBoardCanvasToolbar 
          board={board}
          onBoardUpdate={onBoardUpdate}
          onBoardAction={onBoardAction}
        />
      </div>

      {/* Scrollable Canvas */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full overflow-x-auto overflow-y-hidden">
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
                    columns={columns}
                    onMoveCard={moveCard}
                    onCopyCard={copyCard}
                  />
                ))}
              </SortableContext>
              
              <CreateColumnInline onCreateColumn={addColumn} />
            </div>
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
              <div className="p-2 sm:p-3 bg-background border rounded-lg shadow-lg opacity-50 min-w-64">
                <h4 className="text-sm font-medium">{activeCard.title}</h4>
                {activeCard.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {activeCard.description}
                  </p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
