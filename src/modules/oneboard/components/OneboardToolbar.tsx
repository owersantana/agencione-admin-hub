
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Settings, 
  Download, 
  Archive, 
  Filter,
  Search,
  Edit2,
  Check,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Workspace, Board } from '../config';

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
  onWorkspaceChange,
  onNewCard,
  onExport,
  onArchive,
  onSettings
}: OneboardToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(board.title);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTitleSubmit = () => {
    onBoardTitleChange(editingTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(board.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="border-b border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Board title and workspace selector */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Board title */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSubmit();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="text-lg font-semibold h-8"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleTitleSubmit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleTitleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {board.title}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Workspace selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">em</span>
            <Badge 
              variant="secondary" 
              className="text-sm"
              style={{ backgroundColor: workspace.color + '20', color: workspace.color }}
            >
              {workspace.name}
            </Badge>
          </div>
        </div>

        {/* Center - Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Por responsável</DropdownMenuItem>
              <DropdownMenuItem>Por prioridade</DropdownMenuItem>
              <DropdownMenuItem>Por data</DropdownMenuItem>
              <DropdownMenuItem>Por tags</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={onNewCard}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Card
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
