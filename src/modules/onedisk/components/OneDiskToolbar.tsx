
import { Button } from "@/components/ui/button";
import { HardDrive, Home, ArrowLeft, ArrowRight, FolderPlus, Trash2, Share, Info, List, Grid3X3 } from "lucide-react";

interface OneDiskToolbarProps {
  bucketName: string;
  viewMode: 'list' | 'grid';
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onCreateFolder: () => void;
  onDelete: () => void;
  onShare: () => void;
  onInfo: () => void;
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function OneDiskToolbar({
  bucketName,
  viewMode,
  onNavigateHome,
  onNavigateBack,
  onNavigateForward,
  onCreateFolder,
  onDelete,
  onShare,
  onInfo,
  onViewModeChange
}: OneDiskToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      {/* Left side - Bucket info */}
      <div className="flex items-center space-x-2">
        <HardDrive size={20} className="text-primary" />
        <span className="font-medium text-foreground">{bucketName}</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={onNavigateHome}>
          <Home size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNavigateBack}>
          <ArrowLeft size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNavigateForward}>
          <ArrowRight size={16} />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button variant="ghost" size="sm" onClick={onCreateFolder}>
          <FolderPlus size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare}>
          <Share size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onInfo}>
          <Info size={16} />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button 
          variant={viewMode === 'list' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onViewModeChange('list')}
        >
          <List size={16} />
        </Button>
        <Button 
          variant={viewMode === 'grid' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 size={16} />
        </Button>
      </div>
    </div>
  );
}
