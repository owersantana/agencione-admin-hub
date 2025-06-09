
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Share, Heart, FolderTree, X } from "lucide-react";
import { OneDiskFileTreeSidebar } from "./OneDiskFileTreeSidebar";
import { OneDiskSharedFiles } from "./OneDiskSharedFiles";
import { OneDiskFavoriteFiles } from "./OneDiskFavoriteFiles";
import { useState } from "react";

interface OneDiskSidebarProps {
  usedSpace: number;
  totalSpace: number;
  objectsCount: number;
  currentPath: string;
  onTrashClick: () => void;
  onSharedClick: () => void;
  onFavoritesClick: () => void;
  onNavigate: (path: string) => void;
}

export function OneDiskSidebar({
  usedSpace,
  totalSpace,
  objectsCount,
  currentPath,
  onTrashClick,
  onSharedClick,
  onFavoritesClick,
  onNavigate
}: OneDiskSidebarProps) {
  const [activeView, setActiveView] = useState<'tree' | 'shared' | 'favorites'>('tree');
  const usedPercentage = (usedSpace / totalSpace) * 100;
  const usedGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = (totalSpace / (1024 * 1024 * 1024)).toFixed(0);

  const handleSharedClick = () => {
    setActiveView('shared');
    onSharedClick();
  };

  const handleFavoritesClick = () => {
    setActiveView('favorites');
    onFavoritesClick();
  };

  const handleTreeClick = () => {
    setActiveView('tree');
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          variant={activeView === 'tree' ? 'default' : 'ghost'}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleTreeClick}
        >
          <FolderTree size={16} className="mr-3" />
          Árvore de Arquivos
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onTrashClick}
        >
          <Trash2 size={16} className="mr-3" />
          Lixeira
        </Button>
        <Button
          variant={activeView === 'shared' ? 'default' : 'ghost'}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleSharedClick}
        >
          <Share size={16} className="mr-3" />
          Compartilhados
        </Button>
        <Button
          variant={activeView === 'favorites' ? 'default' : 'ghost'}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleFavoritesClick}
        >
          <Heart size={16} className="mr-3" />
          Favoritos
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto border-t border-sidebar-border">
        {activeView === 'tree' && (
          <OneDiskFileTreeSidebar 
            onNavigate={onNavigate}
            currentPath={currentPath}
          />
        )}
        {activeView === 'shared' && (
          <OneDiskSharedFiles />
        )}
        {activeView === 'favorites' && (
          <OneDiskFavoriteFiles />
        )}
      </div>

      {/* Storage info - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent p-4 rounded-lg">
          <div className="mb-3">
            <div className="flex justify-between text-sm text-sidebar-foreground mb-2">
              <span>Espaço usado</span>
              <span>{usedGB} GB de {totalGB} GB</span>
            </div>
            <Progress value={usedPercentage} className="h-2" />
          </div>
          
          <div className="text-xs text-sidebar-foreground/60 space-y-1">
            <div>Objetos: {objectsCount.toLocaleString()}</div>
            <div>{usedPercentage.toFixed(1)}% utilizado</div>
          </div>
        </div>
      </div>
    </div>
  );
}
