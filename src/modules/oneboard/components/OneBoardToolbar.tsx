
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Grid, Kanban, Columns } from 'lucide-react';
import { Board } from '../config';

interface OneBoardToolbarProps {
  onCreateBoard: () => void;
  onViewModeChange: (mode: 'grid' | 'canvas') => void;
  viewMode: 'grid' | 'canvas';
  activeBoard: Board | null;
  onBackToGrid: () => void;
  onCreateStage?: () => void;
}

export function OneBoardToolbar({
  onCreateBoard,
  onViewModeChange,
  viewMode,
  activeBoard,
  onBackToGrid,
  onCreateStage
}: OneBoardToolbarProps) {
  return (
    <div className="border-b border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeBoard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToGrid}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          )}

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeBoard ? activeBoard.name : 'OneBoard'}
            </h1>
            {activeBoard && (
              <p className="text-sm text-muted-foreground">
                {activeBoard.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!activeBoard && (
            <>
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'canvas' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('canvas')}
                  className="h-8 px-3"
                >
                  <Kanban className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={onCreateBoard} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Board
              </Button>
            </>
          )}

          {activeBoard && onCreateStage && (
            <Button onClick={onCreateStage} className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              Novo Stage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
