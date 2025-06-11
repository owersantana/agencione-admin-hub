
import React, { useState } from 'react';
import { OneBoardToolbar } from '../components/OneBoardToolbar';
import { OneBoardGrid } from '../components/OneBoardGrid';
import { OneBoardCanvas } from '../components/OneBoardCanvas';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { EditBoardModal } from '../components/EditBoardModal';
import { ShareBoardModal } from '../components/ShareBoardModal';
import { Board } from '../config';

export default function OneBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [sharingBoard, setSharingBoard] = useState<Board | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');

  const handleCreateBoard = (name: string, description: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      description,
      columnsCount: 0, // Start with 0 columns
      isActive: true,
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };

    setBoards(prev => [...prev, newBoard]);
    setIsCreateModalOpen(false);
  };

  const handleEditBoard = (name: string, description: string) => {
    if (editingBoard) {
      setBoards(prev => prev.map(board => 
        board.id === editingBoard.id 
          ? { ...board, name, description, updatedAt: new Date().toISOString() }
          : board
      ));
      
      if (activeBoard && activeBoard.id === editingBoard.id) {
        setActiveBoard({ ...activeBoard, name, description, updatedAt: new Date().toISOString() });
      }
    }
    setEditingBoard(null);
    setIsEditModalOpen(false);
  };

  const handleBoardAction = (boardId: string, action: string) => {
    const board = boards.find(b => b.id === boardId);
    
    switch (action) {
      case 'view':
        if (board) {
          setActiveBoard(board);
          setViewMode('canvas');
        }
        break;
      case 'edit':
        if (board) {
          setEditingBoard(board);
          setIsEditModalOpen(true);
        }
        break;
      case 'share':
        if (board) {
          setSharingBoard(board);
          setIsShareModalOpen(true);
          setBoards(prev => prev.map(b => 
            b.id === boardId ? { ...b, isShared: !b.isShared } : b
          ));
        }
        break;
      case 'toggle-active':
        setBoards(prev => prev.map(b => 
          b.id === boardId ? { ...b, isActive: !b.isActive } : b
        ));
        break;
      case 'delete':
        setBoards(prev => prev.filter(b => b.id !== boardId));
        if (activeBoard && activeBoard.id === boardId) {
          setActiveBoard(null);
          setViewMode('grid');
        }
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

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBoard(null);
        }}
        onSubmit={handleEditBoard}
        board={editingBoard}
      />

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingBoard(null);
        }}
        board={sharingBoard}
      />
    </div>
  );
}
