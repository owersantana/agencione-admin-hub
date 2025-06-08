
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanColumn as KanbanColumnType, KanbanItem } from '../config';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddItem?: (columnId: string, title: string) => void;
  onEditItem?: (item: KanbanItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onEditColumn?: (column: KanbanColumnType) => void;
  onDeleteColumn?: (columnId: string) => void;
  onDrop?: (columnId: string, index: number) => void;
  onDragOver?: (columnId: string) => void;
}

export function KanbanColumn({ 
  column, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  onEditColumn,
  onDeleteColumn,
  onDrop,
  onDragOver
}: KanbanColumnProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [editTitle, setEditTitle] = useState(column.title);

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onAddItem?.(column.id, newItemTitle.trim());
      setNewItemTitle('');
      setIsAddingItem(false);
    }
  };

  const handleEditTitle = () => {
    if (editTitle.trim()) {
      onEditColumn?.({ ...column, title: editTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(column.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('text/plain');
    try {
      const { itemId, fromColumnId } = JSON.parse(dragData);
      onDrop?.(column.id, column.items.length);
    } catch (error) {
      console.error('Erro ao processar drop:', error);
    }
  };

  return (
    <Card 
      className="w-80 flex-shrink-0 h-fit max-h-[calc(100vh-200px)] flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleEditTitle()}
              className="text-sm font-medium"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                {column.title}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {column.items.length}
              </span>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                <Edit2 size={14} className="mr-2" />
                Editar título
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteColumn?.(column.id)}
                className="text-destructive"
              >
                <Trash2 size={14} className="mr-2" />
                Excluir coluna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {column.items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'text/plain',
                  JSON.stringify({ itemId: item.id, fromColumnId: column.id })
                );
              }}
            >
              <KanbanCard
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            </div>
          ))}

          {isAddingItem ? (
            <div className="space-y-2">
              <Input
                placeholder="Digite o título do card..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                  if (e.key === 'Escape') setIsAddingItem(false);
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddItem}>
                  Adicionar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAddingItem(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => setIsAddingItem(true)}
            >
              <Plus size={16} className="mr-2" />
              Adicionar card
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
