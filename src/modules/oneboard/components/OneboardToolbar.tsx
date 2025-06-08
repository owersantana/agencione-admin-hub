
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Workspace, Board } from '../config';
import { ArrowLeft, MoreVertical, Plus, Download, Archive, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface OneboardToolbarProps {
  workspace: Workspace;
  board: Board;
  onBoardTitleChange: (title: string) => void;
  onWorkspaceChange: (workspaceId: string) => void;
  onNewCard: () => void;
  onExport: () => void;
  onArchive: () => void;
  onSettings: () => void;
}

export function OneboardToolbar({
  workspace,
  board,
  onBoardTitleChange,
  onNewCard,
  onExport,
  onArchive,
  onSettings
}: OneboardToolbarProps) {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(board.title);

  const handleTitleSave = () => {
    if (editTitle.trim()) {
      onBoardTitleChange(editTitle.trim());
    } else {
      setEditTitle(board.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="border-b border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/oneboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: workspace.color }}
            />
            <span className="text-sm text-muted-foreground">{workspace.name}</span>
            <span className="text-sm text-muted-foreground">/</span>
            
            {isEditingTitle ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setEditTitle(board.title);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleTitleSave}
                className="h-7 text-lg font-semibold w-64"
                autoFocus
              />
            ) : (
              <h1 
                className="text-lg font-semibold cursor-pointer hover:bg-accent px-2 py-1 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {board.title}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onNewCard}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Card
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
