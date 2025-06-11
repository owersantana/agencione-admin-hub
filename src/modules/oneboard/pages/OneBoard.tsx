
import React, { useState } from 'react';
import { OneBoardToolbar } from '../components/OneBoardToolbar';
import { OneBoardGrid } from '../components/OneBoardGrid';
import { OneBoardCanvas } from '../components/OneBoardCanvas';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { Board } from '../config';

export default function OneBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');

  const handleCreateBoard = (name: string, description: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      description,
      columnsCount: 3, // Default: To Do, In Progress, Done
      isActive: true,
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };

    setBoards(prev => [...prev, newBoard]);
    setIsCreateModalOpen(false);
  };

  const handleBoardAction = (boardId: string, action: string) => {
    switch (action) {
      case 'view':
        const board = boards.find(b => b.id === boardId);
        if (board) {
          setActiveBoard(board);
          setViewMode('canvas');
        }
        break;
      case 'edit':
        // TODO: Implement edit modal
        console.log('Edit board:', boardId);
        break;
      case 'share':
        setBoards(prev => prev.map(b => 
          b.id === boardId ? { ...b, isShared: !b.isShared } : b
        ));
        break;
      case 'toggle-active':
        setBoards(prev => prev.map(b => 
          b.id === boardId ? { ...b, isActive: !b.isActive } : b
        ));
        break;
      case 'delete':
        setBoards(prev => prev.filter(b => b.id !== boardId));
        break;
    }
  };

  const handleBackToGrid = () => {
    setActiveBoard(null);
    setViewMode('grid');
  };

  return (
    <div className="h-full flex flex-col">
      <OneBoardToolbar
        onCreateBoard={() => setIsCreateModalOpen(true)}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        activeBoard={activeBoard}
        onBackToGrid={handleBackToGrid}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <OneBoardGrid
            boards={boards}
            onBoardAction={handleBoardAction}
          />
        ) : (
          <OneBoardCanvas
            board={activeBoard}
            onBoardUpdate={(updatedBoard) => {
              setBoards(prev => prev.map(b => 
                b.id === updatedBoard.id ? updatedBoard : b
              ));
              setActiveBoard(updatedBoard);
            }}
          />
        )}
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}
