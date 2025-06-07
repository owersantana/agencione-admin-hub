
import { Button } from "@/components/ui/button";
import { Trash2, Archive, X } from "lucide-react";

interface OneDiskActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onZip: () => void;
  onClearSelection: () => void;
}

export function OneDiskActionBar({
  selectedCount,
  onDelete,
  onZip,
  onClearSelection
}: OneDiskActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 size={14} className="mr-1" />
            Excluir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onZip}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Archive size={14} className="mr-1" />
            Zip
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-primary-foreground hover:bg-primary-foreground/20"
      >
        <X size={16} />
      </Button>
    </div>
  );
}
