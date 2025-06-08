
import { useState } from "react";
import { OneDiskToolbar } from "../components/OneDiskToolbar";
import { OneDiskSidebar } from "../components/OneDiskSidebar";
import { OneDiskFileArea } from "../components/OneDiskFileArea";
import { OneDiskFooter } from "../components/OneDiskFooter";
import { FileItem, BucketInfo } from "../config";

export default function OneDisk() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isInTrash, setIsInTrash] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [bucketInfo] = useState<BucketInfo>({
    id: "bucket-1",
    name: "Meu Bucket",
    uuid: "b8f3c4e2-9a7d-4e1f-8c6b-2d5a9e7f1b3c",
    currentPath: "/documentos/projetos",
    usedSpace: 45 * 1024 * 1024 * 1024, // 45GB
    totalSpace: 100 * 1024 * 1024 * 1024, // 100GB
    objectsCount: 1247
  });

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Pasta de Imagens",
      type: "folder",
      size: 0,
      createdAt: new Date("2024-01-15"),
      modifiedAt: new Date("2024-01-20"),
      shared: false,
      favorite: true,
      path: "/documentos/projetos/imagens",
    },
    {
      id: "2",
      name: "Relatório Mensal.pdf",
      type: "file",
      size: 2560000,
      createdAt: new Date("2024-01-18"),
      modifiedAt: new Date("2024-01-18"),
      shared: true,
      favorite: false,
      path: "/documentos/projetos/relatorio.pdf",
      mimeType: "application/pdf"
    },
    {
      id: "3",
      name: "Apresentação.pptx",
      type: "file",
      size: 15360000,
      createdAt: new Date("2024-01-19"),
      modifiedAt: new Date("2024-01-19"),
      shared: false,
      favorite: true,
      path: "/documentos/projetos/apresentacao.pptx",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    },
    {
      id: "4",
      name: "video_demo.mp4",
      type: "file",
      size: 105600000,
      createdAt: new Date("2024-01-17"),
      modifiedAt: new Date("2024-01-17"),
      shared: false,
      favorite: false,
      path: "/documentos/projetos/video_demo.mp4",
      mimeType: "video/mp4"
    }
  ]);

  const [trashedFiles, setTrashedFiles] = useState<FileItem[]>([]);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      console.log("Navigate to folder:", file.name);
    } else {
      console.log("Open file:", file.name);
    }
  };

  const handleFavoriteToggle = (fileId: string) => {
    const updateFiles = isInTrash ? setTrashedFiles : setFiles;
    updateFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, favorite: !file.favorite } : file
    ));
  };

  const handleShareClick = (fileId: string) => {
    const updateFiles = isInTrash ? setTrashedFiles : setFiles;
    updateFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, shared: !file.shared } : file
    ));
  };

  const handleCreateFolder = () => {
    if (isInTrash) return;
    
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: "",
      type: "folder",
      size: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      shared: false,
      favorite: false,
      path: `${bucketInfo.currentPath}/nova-pasta`,
    };
    
    setFiles(prev => [newFolder, ...prev]);
    setEditingFolderId(newFolder.id);
    console.log("Nova pasta criada");
  };

  const handleFolderRename = (folderId: string, newName: string) => {
    if (newName.trim()) {
      setFiles(prev => prev.map(file => 
        file.id === folderId ? { ...file, name: newName.trim() } : file
      ));
    } else {
      setFiles(prev => prev.filter(file => file.id !== folderId));
    }
    setEditingFolderId(null);
  };

  const handleReload = () => {
    console.log("Recarregando conteúdo...");
    setSelectedItems([]);
  };

  const handleItemSelect = (item: FileItem) => {
    setSelectedItems(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    const currentFiles = isInTrash ? trashedFiles : files;
    setSelectedItems(selected ? currentFiles.map(file => file.id) : []);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    const currentFiles = isInTrash ? trashedFiles : files;
    const selectedFiles = currentFiles.filter(file => selectedItems.includes(file.id));
    
    if (isInTrash) {
      setTrashedFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
      console.log("Itens excluídos permanentemente:", selectedItems);
    } else {
      setTrashedFiles(prev => [...prev, ...selectedFiles]);
      setFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
      console.log("Itens movidos para lixeira:", selectedItems);
    }
    
    setSelectedItems([]);
  };

  const handleRestoreSelected = () => {
    if (!isInTrash || selectedItems.length === 0) return;
    
    const selectedFiles = trashedFiles.filter(file => selectedItems.includes(file.id));
    setFiles(prev => [...prev, ...selectedFiles]);
    setTrashedFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
    setSelectedItems([]);
    console.log("Itens restaurados:", selectedItems);
  };

  const handleEmptyTrash = () => {
    setTrashedFiles([]);
    setSelectedItems([]);
    console.log("Lixeira esvaziada");
  };

  const handleZipSelected = () => {
    console.log("Criando ZIP dos itens:", selectedItems);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handlePathClick = (path: string) => {
    console.log("Navigate to path:", path);
  };

  const handleTrashClick = () => {
    setIsInTrash(true);
    setSelectedItems([]);
    console.log("Mostrando lixeira");
  };

  const handleBackToFiles = () => {
    setIsInTrash(false);
    setSelectedItems([]);
    console.log("Voltando aos arquivos");
  };

  const handleNavigate = (path: string) => {
    console.log("Navigate to:", path);
    setSelectedItems([]);
  };

  const currentFiles = isInTrash ? trashedFiles : files;
  const isTrashEmpty = isInTrash && trashedFiles.length === 0;

  return (
    <div className="h-full flex flex-col">
      <OneDiskToolbar
        bucketName={isInTrash ? "Lixeira" : bucketInfo.name}
        viewMode={viewMode}
        isInTrash={isInTrash}
        onNavigateHome={handleBackToFiles}
        onNavigateBack={() => console.log("Navigate back")}
        onNavigateForward={() => console.log("Navigate forward")}
        onReload={handleReload}
        onCreateFolder={handleCreateFolder}
        onDelete={() => console.log("Delete")}
        onShare={() => console.log("Share")}
        onInfo={() => console.log("Info")}
        onViewModeChange={setViewMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <OneDiskSidebar
          usedSpace={bucketInfo.usedSpace}
          totalSpace={bucketInfo.totalSpace}
          objectsCount={bucketInfo.objectsCount}
          currentPath={isInTrash ? "/lixeira" : bucketInfo.currentPath}
          onTrashClick={handleTrashClick}
          onSharedClick={() => console.log("Show shared")}
          onFavoritesClick={() => console.log("Show favorites")}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {isTrashEmpty ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl opacity-20">🗑️</div>
                <h3 className="text-lg font-medium">Lixeira vazia</h3>
                <p className="text-muted-foreground">
                  Não há itens na lixeira no momento.
                </p>
              </div>
            </div>
          ) : (
            <OneDiskFileArea
              files={currentFiles}
              viewMode={viewMode}
              selectedItems={selectedItems}
              editingFolderId={editingFolderId}
              isInTrash={isInTrash}
              onFileClick={handleFileClick}
              onFavoriteToggle={handleFavoriteToggle}
              onShareClick={handleShareClick}
              onItemSelect={handleItemSelect}
              onSelectAll={handleSelectAll}
              onFolderRename={handleFolderRename}
            />
          )}
          
          <OneDiskFooter
            currentPath={isInTrash ? "/lixeira" : bucketInfo.currentPath}
            bucketUuid={bucketInfo.uuid}
            bucketName={bucketInfo.name}
            selectedItems={selectedItems}
            isInTrash={isInTrash}
            onPathClick={handlePathClick}
            onDeleteSelected={handleDeleteSelected}
            onRestoreSelected={handleRestoreSelected}
            onEmptyTrash={trashedFiles.length > 0 ? handleEmptyTrash : undefined}
            onZipSelected={handleZipSelected}
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>
    </div>
  );
}
