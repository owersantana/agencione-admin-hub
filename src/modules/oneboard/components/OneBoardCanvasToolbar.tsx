import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Star,
  MoreHorizontal,
  Share,
  Users,
  Filter,
  Edit,
  Power,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { Board } from '../config';
import { useToast } from '@/hooks/use-toast';
import { FilterModal, FilterOptions } from './FilterModal';

interface OneBoardCanvasToolbarProps {
  board: Board;
  onBoardUpdate: (board: Board) => void;
  onBoardAction?: (boardId: string, action: string) => void;
  onApplyFilter?: (filters: FilterOptions) => void;
}

export function OneBoardCanvasToolbar({ 
  board, 
  onBoardUpdate, 
  onBoardAction,
  onApplyFilter 
}: OneBoardCanvasToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(board.name);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    search: '',
    priority: [],
    completed: 'all',
    labels: [],
    members: [],
    hasAttachments: false,
    hasDueDate: false,
    overdue: false,
  });
  const { toast } = useToast();

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(board.name);
  };

  const handleTitleSave = () => {
    if (tempTitle.trim() && tempTitle !== board.name) {
      onBoardUpdate({
        ...board,
        name: tempTitle.trim(),
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Board atualizado",
        description: "O nome do board foi alterado com sucesso."
      });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(board.name);
    setIsEditingTitle(false);
  };

  const handleBoardAction = (action: string) => {
    if (onBoardAction) {
      onBoardAction(board.id, action);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleToggleActive = () => {
    onBoardUpdate({
      ...board,
      isActive: !board.isActive,
      updatedAt: new Date().toISOString()
    });
    toast({
      title: board.isActive ? "Board desativado" : "Board ativado",
      description: `O board foi ${board.isActive ? 'desativado' : 'ativado'} com sucesso.`
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    handleBoardAction('delete');
    setShowDeleteModal(false);
  };

  const handleBackToGrid = () => {
    handleBoardAction('back');
  };

  const handleApplyFilter = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
    toast({
      title: "Filtros aplicados",
      description: "Os filtros foram aplicados aos cards do board."
    });
  };

  const getFavoriteStatus = () => {
    const favoritesKey = 'oneboard-favorites';
    const savedFavorites = localStorage.getItem(favoritesKey);
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(board.id);
  };

  const toggleFavorite = () => {
    const favoritesKey = 'oneboard-favorites';
    const savedFavorites = localStorage.getItem(favoritesKey);
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    const updatedFavorites = favorites.includes(board.id)
      ? favorites.filter(id => id !== board.id)
      : [...favorites, board.id];
    
    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    toast({
      title: favorites.includes(board.id) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `O board foi ${favorites.includes(board.id) ? 'removido dos' : 'adicionado aos'} favoritos.`
    });
  };

  const isFavorite = getFavoriteStatus();

  // Get available labels and members for filter
  const availableLabels: Array<{ id: string; name: string; color: string; }> = [];
  const availableMembers: Array<{ id: string; name: string; }> = [];

  if (board.columns) {
    board.columns.forEach(column => {
      column.cards.forEach(card => {
        if (card.labels) {
          card.labels.forEach(label => {
            if (!availableLabels.find(l => l.id === label.id)) {
              availableLabels.push(label);
            }
          });
        }
        if (card.members) {
          card.members.forEach(member => {
            if (!availableMembers.find(m => m.id === member.id)) {
              availableMembers.push({ id: member.id, name: member.name });
            }
          });
        }
      });
    });
  }

  return (
    <>
      <div className="border-b border-border bg-background p-2 sm:p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="text-lg font-semibold flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={handleTitleSave}>
                  Salvar
                </Button>
                <Button variant="outline" size="sm" onClick={handleTitleCancel}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <h1 
                className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-muted-foreground transition-colors truncate flex-1"
                onClick={handleTitleEdit}
                title="Clique para editar"
              >
                {board.name}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToGrid}
              className="p-2"
              title="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleFavorite}
              className="p-2"
              title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilterModal(true)}
              className="p-2"
              title="Filtrar cards"
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
              className="p-2"
              title="Compartilhar"
            >
              <Share className="h-4 w-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleToggleActive}
              className="p-2"
              title={board.isActive ? "Desativar board" : "Ativar board"}
            >
              <Power className={`h-4 w-4 ${board.isActive ? 'text-green-500' : 'text-gray-400'}`} />
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDelete}
              className="p-2 text-destructive hover:text-destructive"
              title="Excluir board"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
        availableLabels={availableLabels}
        availableMembers={availableMembers}
        currentFilters={currentFilters}
      />
    </>
  );
}
