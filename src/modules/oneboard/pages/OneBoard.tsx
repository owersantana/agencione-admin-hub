
import React, { useState } from 'react';
import { OneBoardToolbar } from '../components/OneBoardToolbar';
import { OneBoardGrid } from '../components/OneBoardGrid';
import { OneBoardCanvas } from '../components/OneBoardCanvas';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { EditBoardModal } from '../components/EditBoardModal';
import { ShareBoardModal } from '../components/ShareBoardModal';
import { BoardTemplateModal } from '../components/BoardTemplateModal';
import { Board, BoardColumn } from '../config';

export function OneBoard() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      name: 'Projeto Principal',
      description: 'Quadro para organizar tarefas do projeto principal da empresa',
      columnsCount: 4,
      isActive: true,
      isShared: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'user1'
    },
    {
      id: '2',
      name: 'Marketing Digital',
      description: 'Campanhas e estratégias de marketing digital',
      columnsCount: 3,
      isActive: true,
      isShared: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      createdBy: 'user2'
    },
    {
      id: '3',
      name: 'Desenvolvimento',
      description: 'Tasks de desenvolvimento de software',
      columnsCount: 5,
      isActive: false,
      isShared: false,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12',
      createdBy: 'user1'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [activeBoardColumns, setActiveBoardColumns] = useState<BoardColumn[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [sharingBoard, setSharingBoard] = useState<Board | null>(null);

  const handleBoardAction = (boardId: string, action: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    switch (action) {
      case 'view':
        setActiveBoard(board);
        setActiveBoardColumns([]);
        setViewMode('canvas');
        break;
      case 'edit':
        setEditingBoard(board);
        setIsEditModalOpen(true);
        break;
      case 'share':
        setSharingBoard(board);
        setIsShareModalOpen(true);
        break;
      case 'toggle-active':
        setBoards(prev => prev.map(b => 
          b.id === boardId ? { ...b, isActive: !b.isActive, updatedAt: new Date().toISOString() } : b
        ));
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja excluir este board?')) {
          setBoards(prev => prev.filter(b => b.id !== boardId));
          if (activeBoard?.id === boardId) {
            setActiveBoard(null);
            setViewMode('grid');
          }
        }
        break;
    }
  };

  const handleCreateBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newBoard: Board = {
      ...boardData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    setBoards(prev => [...prev, newBoard]);
    setIsCreateModalOpen(false);
  };

  const handleCreateBoardFromTemplate = (board: Board, columns: BoardColumn[]) => {
    setBoards(prev => [...prev, board]);
    setActiveBoard(board);
    setActiveBoardColumns(columns);
    setViewMode('canvas');
    setIsTemplateModalOpen(false);
  };

  const handleUpdateBoard = (updatedBoard: Board) => {
    setBoards(prev => prev.map(b => 
      b.id === updatedBoard.id ? { ...updatedBoard, updatedAt: new Date().toISOString() } : b
    ));
    if (activeBoard?.id === updatedBoard.id) {
      setActiveBoard(updatedBoard);
    }
    setIsEditModalOpen(false);
    setEditingBoard(null);
  };

  const handleBackToGrid = () => {
    setActiveBoard(null);
    setActiveBoardColumns([]);
    setViewMode('grid');
  };

  const showCreateBoardOptions = () => {
    setIsTemplateModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <OneBoardToolbar
        onCreateBoard={showCreateBoardOptions}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        activeBoard={activeBoard}
        onBackToGrid={handleBackToGrid}
      />

      {viewMode === 'grid' ? (
        <OneBoardGrid boards={boards} onAction={handleBoardAction} />
      ) : (
        <OneBoardCanvas 
          board={activeBoard} 
          onBoardUpdate={handleUpdateBoard}
          initialColumns={activeBoardColumns}
        />
      )}

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBoard(null);
        }}
        board={editingBoard}
        onUpdateBoard={handleUpdateBoard}
      />

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingBoard(null);
        }}
        board={sharingBoard}
      />

      <BoardTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onCreateBoard={handleCreateBoardFromTemplate}
      />
    </div>
  );
}
