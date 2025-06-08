
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanBoard as KanbanBoardType, KanbanItem } from '../config';
import { KanbanColumn } from './KanbanColumn';
import { useKanbanData } from '../hooks/useKanbanData';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  context: string;
  contextId: string;
  board: KanbanBoardType;
}

export function KanbanBoard({ context, contextId, board }: KanbanBoardProps) {
  const { addColumn, addItem, moveItem, updateColumn } = useKanbanData(context, contextId);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(board.id, newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleDrop = (toColumnId: string, newIndex: number, itemId: string, fromColumnId: string) => {
    if (fromColumnId !== toColumnId) {
      moveItem(board.id, itemId, fromColumnId, toColumnId, newIndex);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{board.title}</h1>
          <p className="text-sm text-muted-foreground">
            Contexto: {context} | ID: {contextId}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 pb-6 min-h-0">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddItem={(columnId, title) => addItem(board.id, columnId, title)}
              onEditColumn={(updatedColumn) => updateColumn(board.id, updatedColumn)}
              onDrop={(columnId, index) => {
                // Este será implementado quando tivermos o sistema de drag completo
              }}
            />
          ))}

          {/* Adicionar nova coluna */}
          <div className="w-80 flex-shrink-0">
            {isAddingColumn ? (
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <Input
                  placeholder="Digite o título da coluna..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') setIsAddingColumn(false);
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddColumn}>
                    Adicionar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsAddingColumn(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full h-12 border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus size={16} className="mr-2" />
                Adicionar coluna
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
