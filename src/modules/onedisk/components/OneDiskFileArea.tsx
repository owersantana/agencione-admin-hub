
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
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  modified: Date;
  fileType?: string;
  thumbnail?: string;
}

interface OneDiskFileAreaProps {
  currentPath: string;
  viewMode: 'list' | 'grid';
  isInTrash?: boolean;
  onNavigate: (path: string) => void;
  onItemSelect: (item: FileItem) => void;
  onItemDoubleClick: (item: FileItem) => void;
  onUpload: (files: FileList) => void;
}

// Mock data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documentos',
    type: 'folder',
    modified: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Imagens',
    type: 'folder',
    modified: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'projeto.pdf',
    type: 'file',
    size: 2048000,
    modified: new Date('2024-01-12'),
    fileType: 'pdf',
  },
  {
    id: '4',
    name: 'apresentacao.pptx',
    type: 'file',
    size: 5120000,
    modified: new Date('2024-01-08'),
    fileType: 'presentation',
  },
  {
    id: '5',
    name: 'planilha.xlsx',
    type: 'file',
    size: 1024000,
    modified: new Date('2024-01-05'),
    fileType: 'spreadsheet',
  },
  {
    id: '6',
    name: 'video_tutorial.mp4',
    type: 'file',
    size: 15728640,
    modified: new Date('2024-01-03'),
    fileType: 'video',
  },
];

export function OneDiskFileArea({
  currentPath,
  viewMode,
  isInTrash = false,
  onNavigate,
  onItemSelect,
  onItemDoubleClick,
  onUpload
}: OneDiskFileAreaProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return Folder;
    
    switch (item.fileType) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      case 'zip':
      case 'rar':
        return Archive;
      case 'mp3':
      case 'wav':
        return Music;
      case 'mp4':
      case 'avi':
        return Video;
      default:
        return File;
    }
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
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedItems([item.id]);
    }
    onItemSelect(item);
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      onNavigate(`${currentPath}/${item.name}`);
    } else {
      onItemDoubleClick(item);
    }
  };

  const handleRename = (item: FileItem) => {
    setEditingItem(item.id);
    setEditingName(item.name);
  };

  const handleRenameSubmit = () => {
    // Implementar lógica de renomear
    console.log('Renomeando para:', editingName);
    setEditingItem(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingItem(null);
    setEditingName('');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onUpload(files);
    }
  };

  const renderListView = () => (
    <div className="space-y-1">
      {/* Upload area */}
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

      {/* File list */}
      <div className="space-y-1">
        {mockFiles.map((item) => {
          const Icon = getFileIcon(item);
          const isSelected = selectedItems.includes(item.id);
          const isEditing = editingItem === item.id;

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
                  if (checked) {
                    setSelectedItems(prev => [...prev, item.id]);
                  } else {
                    setSelectedItems(prev => prev.filter(id => id !== item.id));
                  }
                }}
              />
              
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit();
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                    onBlur={handleRenameSubmit}
                    className="h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {item.size && (
                  <span className="w-16 text-right">
                    {formatFileSize(item.size)}
                  </span>
                )}
                <span className="w-32 text-right">
                  {formatDate(item.modified)}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRename(item)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
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

      {/* File grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {mockFiles.map((item) => {
          const Icon = getFileIcon(item);
          const isSelected = selectedItems.includes(item.id);
          const isEditing = editingItem === item.id;

          return (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={(e) => handleItemClick(item, e)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                    <Checkbox
                      className="absolute -top-1 -right-1 h-4 w-4"
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(prev => [...prev, item.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </div>
                  
                  <div className="w-full text-center">
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit();
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        onBlur={handleRenameSubmit}
                        className="h-7 text-xs text-center"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-medium text-center block truncate px-1">
                        {item.name}
                      </span>
                    )}
                  </div>
                  
                  {item.size && (
                    <Badge variant="secondary" className="text-xs">
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
                    <DropdownMenuItem onClick={() => handleRename(item)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Compartilhar
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
