
import { ChevronRight } from "lucide-react";
import { OneDiskActionBar } from "./OneDiskActionBar";

interface OneDiskFooterProps {
  currentPath: string;
  bucketUuid: string;
  selectedItems: string[];
  onPathClick: (path: string) => void;
  onDeleteSelected: () => void;
  onZipSelected: () => void;
  onClearSelection: () => void;
}

export function OneDiskFooter({
  currentPath,
  bucketUuid,
  selectedItems,
  onPathClick,
  onDeleteSelected,
  onZipSelected,
  onClearSelection
}: OneDiskFooterProps) {
  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
  
  return (
    <div className="border-t border-border">
      <OneDiskActionBar
        selectedCount={selectedItems.length}
        onDelete={onDeleteSelected}
        onZip={onZipSelected}
        onClearSelection={onClearSelection}
      />
      
      <div className="flex items-center justify-between p-4 bg-background">
        {/* Left side - Breadcrumb path */}
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <button
            onClick={() => onPathClick('/')}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          
          {pathSegments.map((segment, index) => {
            const fullPath = '/' + pathSegments.slice(0, index + 1).join('/');
            return (
              <div key={index} className="flex items-center space-x-1">
                <ChevronRight size={14} />
                <button
                  onClick={() => onPathClick(fullPath)}
                  className="hover:text-foreground transition-colors"
                >
                  {segment}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right side - Bucket UUID */}
        <div className="text-xs text-muted-foreground font-mono">
          {bucketUuid}
        </div>
      </div>
    </div>
  );
}
