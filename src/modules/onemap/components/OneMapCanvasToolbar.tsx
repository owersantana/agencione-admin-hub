
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Plus, Save, Trash2, Undo, Redo } from 'lucide-react';

interface OneMapCanvasToolbarProps {
  zoom: number;
  onZoom: (delta: number) => void;
  onAddNode: () => void;
  onSave: () => void;
  selectedNodeId?: string | null;
  onDeleteNode?: () => void;
}

export function OneMapCanvasToolbar({
  zoom,
  onZoom,
  onAddNode,
  onSave,
  selectedNodeId,
  onDeleteNode,
}: OneMapCanvasToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-background">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onAddNode}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Nó
        </Button>
        
        {selectedNodeId && onDeleteNode && (
          <Button variant="outline" size="sm" onClick={onDeleteNode}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir Selecionado
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => onZoom(-0.1)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="outline" size="sm" onClick={() => onZoom(0.1)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
}
