import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Image, Film, Music, Archive, Heart, Share } from "lucide-react";
import { FileItem } from "../config";

interface OneDiskFileAreaProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
  onFileClick: (file: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
}

export function OneDiskFileArea({
  files,
  viewMode,
  onFileClick,
  onFavoriteToggle,
  onShareClick
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

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
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
              className="cursor-pointer hover:bg-accent"
              onClick={() => onFileClick(file)}
            >
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
