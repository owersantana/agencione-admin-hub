
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Folder, FileText, Image, Film, Music, Archive, Heart, Share } from "lucide-react";
import { FileItem } from "../config";
import { useState, useEffect, useRef } from "react";

interface OneDiskFileAreaProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
  selectedItems: string[];
  editingFolderId?: string | null;
  isInTrash?: boolean;
  onFileClick: (file: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
  onItemSelect: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onFolderRename?: (folderId: string, newName: string) => void;
}

export function OneDiskFileArea({
  files,
  viewMode,
  selectedItems,
  editingFolderId,
  isInTrash = false,
  onFileClick,
  onFavoriteToggle,
  onShareClick,
  onItemSelect,
  onSelectAll,
  onFolderRename
}: OneDiskFileAreaProps) {
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFolderId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingFolderId]);

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

  const handleNameSubmit = (fileId: string) => {
    if (onFolderRename) {
      onFolderRename(fileId, editingName);
    }
    setEditingName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, fileId: string) => {
    if (e.key === 'Enter') {
      handleNameSubmit(fileId);
    } else if (e.key === 'Escape') {
      if (onFolderRename) {
        onFolderRename(fileId, "");
      }
      setEditingName("");
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">
            {isInTrash ? "Lixeira vazia" : "Nenhum arquivo encontrado"}
          </p>
          <p className="text-sm">
            {isInTrash 
              ? "Itens excluídos aparecerão aqui" 
              : "Adicione arquivos ou crie uma nova pasta para começar"
            }
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="flex-1 overflow-auto p-2 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-2 sm:p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                selectedItems.includes(file.id) ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => !editingFolderId && onFileClick(file)}
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
                      className={`${file.favorite ? "text-red-500" : "text-muted-foreground"} h-6 w-6 p-0`}
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
                      className={`${file.shared ? "text-blue-500" : "text-muted-foreground"} h-6 w-6 p-0`}
                    >
                      <Share size={12} />
                    </Button>
                  </div>
                </div>
                <div className="text-center w-full">
                  {getFileIcon(file)}
                  {editingFolderId === file.id ? (
                    <Input
                      ref={inputRef}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleNameSubmit(file.id)}
                      onKeyDown={(e) => handleKeyPress(e, file.id)}
                      className="mt-2 h-8 text-xs"
                      placeholder="Nome da pasta"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-medium mt-2 truncate w-full">{file.name}</p>
                  )}
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
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
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
                onClick={() => !editingFolderId && onFileClick(file)}
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
                  {editingFolderId === file.id ? (
                    <Input
                      ref={inputRef}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleNameSubmit(file.id)}
                      onKeyDown={(e) => handleKeyPress(e, file.id)}
                      className="h-8"
                      placeholder="Nome da pasta"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    file.name
                  )}
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

      {/* Mobile view - Card layout */}
      <div className="sm:hidden p-4 space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className={`p-3 border rounded-lg ${
              selectedItems.includes(file.id) ? 'bg-accent border-primary' : ''
            }`}
            onClick={() => !editingFolderId && onFileClick(file)}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedItems.includes(file.id)}
                onCheckedChange={(checked) => onItemSelect(file.id, !!checked)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
              <div className="flex-shrink-0 mt-1">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                {editingFolderId === file.id ? (
                  <Input
                    ref={inputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleNameSubmit(file.id)}
                    onKeyDown={(e) => handleKeyPress(e, file.id)}
                    className="h-8 mb-2"
                    placeholder="Nome da pasta"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="font-medium truncate">{file.name}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
              <div className="flex space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFavoriteToggle(file.id)}
                  className={`${file.favorite ? "text-red-500" : "text-muted-foreground"} h-8 w-8 p-0`}
                >
                  <Heart size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShareClick(file.id)}
                  className={`${file.shared ? "text-blue-500" : "text-muted-foreground"} h-8 w-8 p-0`}
                >
                  <Share size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
