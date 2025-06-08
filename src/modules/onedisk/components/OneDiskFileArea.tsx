
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileItem } from '../config';
import { OneDiskFileItem } from './OneDiskFileItem';
import { OneDiskFilePreview } from './OneDiskFilePreview';

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
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    console.log("Item clicked:", item.name);
    if (event.ctrlKey || event.metaKey) {
      // Multi-select logic
      onItemSelect(item);
    } else {
      // Single select
      onItemSelect(item);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    console.log("Item double clicked:", item.name);
    if (item.type === 'folder') {
      onFileClick(item); // Navigate to folder
    } else {
      setPreviewFile(item); // Show preview for files
    }
  };

  const handleRename = (item: FileItem) => {
    if (item.type === 'folder') {
      setEditingName(item.name);
    }
  };

  const handleRenameSubmit = (folderId: string) => {
    const trimmedName = editingName.trim();
    if (trimmedName) {
      onFolderRename(folderId, trimmedName);
    } else {
      // Se nome vazio, cancela a edição e remove a pasta se foi criada recentemente
      const folder = files.find(f => f.id === folderId);
      if (folder && folder.name === '') {
        onFolderRename(folderId, ''); // Isso irá remover a pasta
      }
    }
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingName('');
    // Se estava editando uma pasta nova (sem nome), remove ela
    const editingFolder = files.find(f => f.id === editingFolderId);
    if (editingFolder && editingFolder.name === '') {
      onFolderRename(editingFolderId!, '');
    }
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

  const renderUploadArea = () => (
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
  );

  const renderListView = () => (
    <div className="space-y-1">
      {!isInTrash && renderUploadArea()}
      <div className="space-y-1">
        {files.map((item) => (
          <OneDiskFileItem
            key={item.id}
            item={item}
            viewMode="list"
            isSelected={selectedItems.includes(item.id)}
            isEditing={editingFolderId === item.id}
            editingName={editingName}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onFavoriteToggle={onFavoriteToggle}
            onShareClick={onShareClick}
            onRename={handleRename}
            onEditingNameChange={setEditingName}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={handleRenameCancel}
          />
        ))}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="space-y-4">
      {!isInTrash && renderUploadArea()}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {files.map((item) => (
          <OneDiskFileItem
            key={item.id}
            item={item}
            viewMode="grid"
            isSelected={selectedItems.includes(item.id)}
            isEditing={editingFolderId === item.id}
            editingName={editingName}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onFavoriteToggle={onFavoriteToggle}
            onShareClick={onShareClick}
            onRename={handleRename}
            onEditingNameChange={setEditingName}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={handleRenameCancel}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-4 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      
      {viewMode === 'list' ? renderListView() : renderGridView()}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <OneDiskFilePreview
            file={previewFile}
            onClose={() => setPreviewFile(null)}
            onDownload={() => console.log('Download:', previewFile.name)}
            onShare={() => console.log('Share:', previewFile.name)}
          />
        </div>
      )}
    </div>
  );
}
