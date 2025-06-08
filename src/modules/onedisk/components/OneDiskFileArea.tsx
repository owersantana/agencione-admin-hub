
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Folder, 
  File, 
  Image, 
  FileText, 
  Archive, 
  Music, 
  Video,
  Download,
  MoreHorizontal,
  Edit2,
  Trash2,
  Share,
  Info,
  Upload,
  Plus,
  Heart,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { FileItem } from '../config';

interface OneDiskFileAreaProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
  selectedItems: string[];
  editingFolderId: string | null;
  isInTrash?: boolean;
  onFileClick: (file: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
  onItemSelect: (item: FileItem) => void;
  onSelectAll: (selected: boolean) => void;
  onFolderRename: (folderId: string, newName: string) => void;
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
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return Folder;
    
    const mimeType = item.mimeType || '';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('image')) return Image;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    if (mimeType.includes('audio')) return Music;
    if (mimeType.includes('video')) return Video;
    
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select logic would go here
    } else {
      onItemSelect(item);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    onFileClick(item);
  };

  const handleRename = (item: FileItem) => {
    if (item.type === 'folder') {
      setEditingName(item.name);
    }
  };

  const handleRenameSubmit = (folderId: string) => {
    if (editingName.trim()) {
      onFolderRename(folderId, editingName.trim());
    }
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingName('');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Files selected for upload:', files);
      // Upload logic would be implemented here
    }
  };

  const renderListView = () => (
    <div className="space-y-1">
      {/* Upload area */}
      {!isInTrash && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 mb-4 hover:border-muted-foreground/50 transition-colors">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <Button variant="outline" onClick={handleFileUpload}>
              <Plus className="h-4 w-4 mr-2" />
              Selecionar arquivos
            </Button>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="space-y-1">
        {files.map((item) => {
          const Icon = getFileIcon(item);
          const isSelected = selectedItems.includes(item.id);
          const isEditing = editingFolderId === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer border",
                isSelected && "bg-accent border-primary"
              )}
              onClick={(e) => handleItemClick(item, e)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  // Checkbox logic would trigger selection
                }}
              />
              
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(item.id);
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                    onBlur={() => handleRenameSubmit(item.id)}
                    className="h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                    {item.favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                    {item.shared && <Share2 className="h-4 w-4 text-blue-500" />}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {item.size > 0 && (
                  <span className="w-16 text-right">
                    {formatFileSize(item.size)}
                  </span>
                )}
                <span className="w-32 text-right">
                  {formatDate(item.modifiedAt)}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.type === 'folder' && (
                    <DropdownMenuItem onClick={() => handleRename(item)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Renomear
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShareClick(item.id)}>
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFavoriteToggle(item.id)}>
                    <Heart className="h-4 w-4 mr-2" />
                    {item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Info className="h-4 w-4 mr-2" />
                    Informações
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="space-y-4">
      {/* Upload area */}
      {!isInTrash && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <Button variant="outline" onClick={handleFileUpload}>
              <Plus className="h-4 w-4 mr-2" />
              Selecionar arquivos
            </Button>
          </div>
        </div>
      )}

      {/* File grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {files.map((item) => {
          const Icon = getFileIcon(item);
          const isSelected = selectedItems.includes(item.id);
          const isEditing = editingFolderId === item.id;

          return (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all group relative",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={(e) => handleItemClick(item, e)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                    <Checkbox
                      className="absolute -top-1 -right-1 h-4 w-4"
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        // Checkbox logic would trigger selection
                      }}
                    />
                    
                    {/* Status indicators */}
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      {item.favorite && <Heart className="h-3 w-3 text-red-500 fill-current" />}
                      {item.shared && <Share2 className="h-3 w-3 text-blue-500" />}
                    </div>
                  </div>
                  
                  <div className="w-full text-center">
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(item.id);
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        onBlur={() => handleRenameSubmit(item.id)}
                        className="h-6 text-xs text-center p-1"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-medium text-center block truncate px-1" title={item.name}>
                        {item.name}
                      </span>
                    )}
                  </div>
                  
                  {item.size > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {formatFileSize(item.size)}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {item.type === 'folder' && (
                      <DropdownMenuItem onClick={() => handleRename(item)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Renomear
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShareClick(item.id)}>
                      <Share className="h-4 w-4 mr-2" />
                      Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFavoriteToggle(item.id)}>
                      <Heart className="h-4 w-4 mr-2" />
                      {item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Info className="h-4 w-4 mr-2" />
                      Informações
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      
      {viewMode === 'list' ? renderListView() : renderGridView()}
    </div>
  );
}
