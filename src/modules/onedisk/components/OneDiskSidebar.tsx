
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Share, Heart } from "lucide-react";

interface OneDiskSidebarProps {
  usedSpace: number;
  totalSpace: number;
  objectsCount: number;
  onTrashClick: () => void;
  onSharedClick: () => void;
  onFavoritesClick: () => void;
}

export function OneDiskSidebar({
  usedSpace,
  totalSpace,
  objectsCount,
  onTrashClick,
  onSharedClick,
  onFavoritesClick
}: OneDiskSidebarProps) {
  const usedPercentage = (usedSpace / totalSpace) * 100;
  const usedGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = (totalSpace / (1024 * 1024 * 1024)).toFixed(0);

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col p-4">
      {/* Navigation */}
      <div className="space-y-2 mb-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onTrashClick}
        >
          <Trash2 size={16} className="mr-3" />
          Lixeira
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onSharedClick}
        >
          <Share size={16} className="mr-3" />
          Compartilhados
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onFavoritesClick}
        >
          <Heart size={16} className="mr-3" />
          Favoritos
        </Button>
      </div>

      {/* Storage info - Fixed at bottom */}
      <div className="mt-auto">
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
