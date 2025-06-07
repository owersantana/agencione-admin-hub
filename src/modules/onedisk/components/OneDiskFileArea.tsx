
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FileText, Image, Film, Music, Archive, Heart, Share } from "lucide-react";
import { FileItem } from "../config";

interface OneDiskFileAreaProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
  selectedItems: string[];
  onFileClick: (file: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
  onItemSelect: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function OneDiskFileArea({
  files,
  viewMode,
  selectedItems,
  onFileClick,
  onFavoriteToggle,
  onShareClick,
  onItemSelect,
  onSelectAll
}: OneDiskFileAreaProps) {
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder size={20} className="text-blue-500" />;
    
    const mimeType = file.mimeType || '';
    if (mimeType.startsWith('image/')) return <Image size={20} className="text-green-500" />;
    if (mimeType.startsWith('video/')) return <Film size={20} className="text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music size={20} className="text-orange-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive size={20} className="text-gray-500" />;
    
    return <FileText size={20} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const allSelected = files.length > 0 && files.every(file => selectedItems.includes(file.id));
  const someSelected = selectedItems.length > 0 && !allSelected;

  if (viewMode === 'grid') {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                selectedItems.includes(file.id) ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => onFileClick(file)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-between w-full">
                  <Checkbox
                    checked={selectedItems.includes(file.id)}
                    onCheckedChange={(checked) => onItemSelect(file.id, !!checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(file.id);
                      }}
                      className={file.favorite ? "text-red-500" : "text-muted-foreground"}
                    >
                      <Heart size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareClick(file.id);
                      }}
                      className={file.shared ? "text-blue-500" : "text-muted-foreground"}
                    >
                      <Share size={12} />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  {getFileIcon(file)}
                  <p className="text-sm font-medium mt-2 truncate w-full">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-32">Tamanho</TableHead>
            <TableHead className="w-48">Modificado</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow 
              key={file.id} 
              className={`cursor-pointer hover:bg-accent ${
                selectedItems.includes(file.id) ? 'bg-accent' : ''
              }`}
              onClick={() => onFileClick(file)}
            >
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(file.id)}
                  onCheckedChange={(checked) => onItemSelect(file.id, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                {getFileIcon(file)}
              </TableCell>
              <TableCell className="font-medium">
                {file.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatFileSize(file.size)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(file.modifiedAt)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFavoriteToggle(file.id)}
                    className={file.favorite ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShareClick(file.id)}
                    className={file.shared ? "text-blue-500" : "text-muted-foreground"}
                  >
                    <Share size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
