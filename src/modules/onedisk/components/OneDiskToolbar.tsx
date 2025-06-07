
import { Button } from "@/components/ui/button";
import { HardDrive, Home, ArrowLeft, ArrowRight, FolderPlus, Trash2, Share, Info, List, Grid3X3, RefreshCcw } from "lucide-react";

interface OneDiskToolbarProps {
  bucketName: string;
  viewMode: 'list' | 'grid';
  isInTrash?: boolean;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onReload: () => void;
  onCreateFolder: () => void;
  onDelete: () => void;
  onShare: () => void;
  onInfo: () => void;
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function OneDiskToolbar({
  bucketName,
  viewMode,
  isInTrash = false,
  onNavigateHome,
  onNavigateBack,
  onNavigateForward,
  onReload,
  onCreateFolder,
  onDelete,
  onShare,
  onInfo,
  onViewModeChange
}: OneDiskToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border bg-background">
      {/* Left side - Bucket info */}
      <div className="flex items-center space-x-2 min-w-0">
        <HardDrive size={20} className="text-primary flex-shrink-0" />
        <span className="font-medium text-foreground truncate">{bucketName}</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1">
        {/* Navigation controls */}
        <div className="hidden sm:flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={onNavigateHome} title={isInTrash ? "Voltar aos arquivos" : "Home"}>
            <Home size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNavigateBack} title="Voltar">
            <ArrowLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNavigateForward} title="Avançar">
            <ArrowRight size={16} />
          </Button>
        </div>
        
        {/* Reload button */}
        <Button variant="ghost" size="sm" onClick={onReload} title="Recarregar">
          <RefreshCcw size={16} />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1 sm:mx-2 hidden sm:block" />
        
        {/* File operations - hidden in trash */}
        {!isInTrash && (
          <>
            <Button variant="ghost" size="sm" onClick={onCreateFolder} title="Nova pasta">
              <FolderPlus size={16} />
            </Button>
            <div className="hidden sm:flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={onDelete} title="Excluir">
                <Trash2 size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onShare} title="Compartilhar">
                <Share size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onInfo} title="Informações">
                <Info size={16} />
              </Button>
            </div>
            <div className="w-px h-6 bg-border mx-1 sm:mx-2 hidden sm:block" />
          </>
        )}
        
        {/* View mode controls */}
        <div className="flex items-center space-x-1">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onViewModeChange('list')}
            title="Visualização em lista"
          >
            <List size={16} />
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onViewModeChange('grid')}
            title="Visualização em grade"
          >
            <Grid3X3 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
