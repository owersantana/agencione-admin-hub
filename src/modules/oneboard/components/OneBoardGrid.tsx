
import React from 'react';
import { OneBoardCard } from './OneBoardCard';
import { Board } from '../config';

interface OneBoardGridProps {
  boards: Board[];
  onBoardAction: (boardId: string, action: string) => void;
}

export function OneBoardGrid({ boards, onBoardAction }: OneBoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum board encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro board para começar a organizar suas tarefas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <OneBoardCard
            key={board.id}
            board={board}
            onAction={onBoardAction}
          />
        ))}
      </div>
    </div>
  );
}
