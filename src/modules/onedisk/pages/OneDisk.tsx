
import React, { useState } from 'react';
import { OneDiskSidebar } from '../components/OneDiskSidebar';
import { OneDiskToolbar } from '../components/OneDiskToolbar';
import { OneDiskFileArea } from '../components/OneDiskFileArea';
import { OneDiskShareModal } from '../components/OneDiskShareModal';
import { FileItem } from '../config';
import { useIsMobile } from '@/hooks/use-mobile';

const mockFiles: FileItem[] = [
  {
    id: "5",
    name: "Apresentação da Empresa.pptx",
    type: "file",
    size: 5500000,
    createdAt: new Date("2024-01-10"),
    modifiedAt: new Date("2024-01-12"),
    shared: true,
    favorite: false,
    path: "/apresentacao.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  },
  {
    id: "6",
    name: "Financeiro 2023.xlsx",
    type: "file",
    size: 2800000,
    createdAt: new Date("2024-01-05"),
    modifiedAt: new Date("2024-01-08"),
    shared: false,
    favorite: true,
    path: "/financeiro.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  },
  {
    id: "7",
    name: "Estratégia de Marketing.docx",
    type: "file",
    size: 3200000,
    createdAt: new Date("2023-12-28"),
    modifiedAt: new Date("2024-01-02"),
    shared: true,
    favorite: true,
    path: "/estrategia.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },
  {
    id: "8",
    name: "Plano de Contratações.pdf",
    type: "file",
    size: 1500000,
    createdAt: new Date("2023-12-20"),
    modifiedAt: new Date("2023-12-24"),
    shared: false,
    favorite: false,
    path: "/plano.pdf",
    mimeType: "application/pdf"
  },
  {
    id: "9",
    name: "Diretrizes de Design.txt",
    type: "file",
    size: 50000,
    createdAt: new Date("2023-12-15"),
    modifiedAt: new Date("2023-12-18"),
    shared: true,
    favorite: false,
    path: "/diretrizes.txt",
    mimeType: "text/plain"
  },
  {
    id: "10",
    name: "Backup do Sistema.zip",
    type: "file",
    size: 2100000000,
    createdAt: new Date("2023-12-10"),
    modifiedAt: new Date("2023-12-12"),
    shared: false,
    favorite: false,
    path: "/backup.zip",
    mimeType: "application/zip"
  },
  {
    id: "11",
    name: "Músicas Favoritas.mp3",
    type: "file",
    size: 6800000,
    createdAt: new Date("2023-12-01"),
    modifiedAt: new Date("2023-12-05"),
    shared: true,
    favorite: true,
    path: "/musicas.mp3",
    mimeType: "audio/mpeg"
  },
  {
    id: "12",
    name: "Vídeo Institucional.mp4",
    type: "file",
    size: 150000000,
    createdAt: new Date("2023-11-25"),
    modifiedAt: new Date("2023-11-30"),
    shared: false,
    favorite: false,
    path: "/video.mp4",
    mimeType: "video/mp4"
  },
  {
    id: "13",
    name: "Roteiro da Apresentação.key",
    type: "file",
    size: 4200000,
    createdAt: new Date("2023-11-20"),
    modifiedAt: new Date("2023-11-22"),
    shared: true,
    favorite: false,
    path: "/roteiro.key",
    mimeType: "application/vnd.apple.keynote"
  },
  {
    id: "14",
    name: "Ícones do Projeto.svg",
    type: "file",
    size: 900000,
    createdAt: new Date("2023-11-15"),
    modifiedAt: new Date("2023-11-17"),
    shared: false,
    favorite: true,
    path: "/icones.svg",
    mimeType: "image/svg+xml"
  },
  {
    id: "1",
    name: "Pasta de Imagens",
    type: "folder",
    size: 0,
    createdAt: new Date("2024-01-15"),
    modifiedAt: new Date("2024-01-20"),
    shared: false,
    favorite: true,
    path: "/imagens",
  },
  {
    id: "2",
    name: "Manual.pdf",
    type: "file",
    size: 1200000,
    createdAt: new Date("2024-01-18"),
    modifiedAt: new Date("2024-01-18"),
    shared: false,
    favorite: false,
    path: "/manual.pdf",
    mimeType: "application/pdf"
  },
  {
    id: "3",
    name: "Documentos",
    type: "folder",
    size: 0,
    createdAt: new Date("2024-01-16"),
    modifiedAt: new Date("2024-01-21"),
    shared: true,
    favorite: false,
    path: "/documentos",
  },
  {
    id: "4",
    name: "Downloads",
    type: "folder",
    size: 0,
    createdAt: new Date("2024-01-14"),
    modifiedAt: new Date("2024-01-17"),
    shared: false,
    favorite: false,
    path: "/downloads",
  }
];

const mockFolderContents = {
  '/': mockFiles,
  '/imagens': [
    {
      id: "img1",
      name: "foto1.jpg",
      type: "file" as const,
      size: 850000,
      createdAt: new Date("2024-01-19"),
      modifiedAt: new Date("2024-01-19"),
      shared: true,
      favorite: false,
      path: "/imagens/foto1.jpg",
      mimeType: "image/jpeg"
    },
    {
      id: "img2",
      name: "screenshot.png",
      type: "file" as const,
      size: 450000,
      createdAt: new Date("2024-01-20"),
      modifiedAt: new Date("2024-01-20"),
      shared: false,
      favorite: true,
      path: "/imagens/screenshot.png",
      mimeType: "image/png"
    }
  ],
  '/documentos': [
    {
      id: "doc1",
      name: "Contrato.pdf",
      type: "file" as const,
      size: 2560000,
      createdAt: new Date("2024-01-17"),
      modifiedAt: new Date("2024-01-17"),
      shared: false,
      favorite: false,
      path: "/documentos/contrato.pdf",
      mimeType: "application/pdf"
    },
    {
      id: "projetos",
      name: "Projetos",
      type: "folder" as const,
      size: 0,
      createdAt: new Date("2024-01-16"),
      modifiedAt: new Date("2024-01-21"),
      shared: true,
      favorite: false,
      path: "/documentos/projetos",
    }
  ],
  '/documentos/projetos': [
    {
      id: "proj1",
      name: "Projeto A",
      type: "folder" as const,
      size: 0,
      createdAt: new Date("2024-01-16"),
      modifiedAt: new Date("2024-01-21"),
      shared: true,
      favorite: false,
      path: "/documentos/projetos/projeto-a",
    },
    {
      id: "proj2",
      name: "Relatório.docx",
      type: "file" as const,
      size: 1800000,
      createdAt: new Date("2024-01-18"),
      modifiedAt: new Date("2024-01-18"),
      shared: false,
      favorite: true,
      path: "/documentos/projetos/relatorio.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
  ],
  '/downloads': [
    {
      id: "down1",
      name: "video_demo.mp4",
      type: "file" as const,
      size: 105600000,
      createdAt: new Date("2024-01-17"),
      modifiedAt: new Date("2024-01-17"),
      shared: false,
      favorite: false,
      path: "/downloads/video_demo.mp4",
      mimeType: "video/mp4"
    }
  ]
};

export default function OneDisk() {
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [shareModalItem, setShareModalItem] = useState<FileItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'files' | 'trash' | 'shared' | 'favorites'>('files');
  
  const isMobile = useIsMobile();

  const usedSpace = 2.1 * 1024 * 1024 * 1024; // 2.1 GB
  const totalSpace = 100 * 1024 * 1024 * 1024; // 100 GB
  const objectsCount = 145;

  const currentFiles = React.useMemo(() => {
    if (currentView === 'shared') {
      return getAllFiles().filter(file => file.shared);
    }
    if (currentView === 'favorites') {
      return getAllFiles().filter(file => file.favorite);
    }
    if (currentView === 'trash') {
      return [];
    }
    return mockFolderContents[currentPath as keyof typeof mockFolderContents] || [];
  }, [currentPath, currentView]);

  const getAllFiles = () => {
    const allFiles: FileItem[] = [];
    Object.values(mockFolderContents).forEach(folderFiles => {
      allFiles.push(...folderFiles);
    });
    return allFiles;
  };

  const handleNavigateToFolder = (item: FileItem) => {
    if (item.type === 'folder') {
      console.log("Navigate to:", item.path);
      setCurrentPath(item.path);
      setCurrentView('files');
    }
  };

  const handleNavigate = (path: string) => {
    console.log("Navigate to:", path);
    setCurrentPath(path);
    setCurrentView('files');
  };

  const handleCreateFolder = () => {
    console.log("Nova pasta criada");
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name: "",
      type: "folder",
      size: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      shared: false,
      favorite: false,
      path: `${currentPath}/nova-pasta`,
    };
    
    setFiles(prev => [...prev, newFolder]);
    setEditingFolderId(newFolder.id);
  };

  const handleFolderRename = (folderId: string, newName: string) => {
    if (newName.trim() === '') {
      // Remove folder if name is empty
      setFiles(prev => prev.filter(f => f.id !== folderId));
    } else {
      // Update folder name
      setFiles(prev => prev.map(f => 
        f.id === folderId 
          ? { ...f, name: newName.trim() }
          : f
      ));
    }
    setEditingFolderId(null);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      handleNavigateToFolder(file);
    }
  };

  const handleItemSelect = (item: FileItem) => {
    setSelectedItems(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleFavoriteToggle = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, favorite: !f.favorite }
        : f
    ));
  };

  const handleShareClick = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setShareModalItem(file);
    }
  };

  const handleReload = () => {
    console.log("Recarregando diretório atual:", currentPath);
    // Simulate reload by updating modified date
    setFiles(prev => prev.map(f => ({ ...f, modifiedAt: new Date() })));
  };

  const handleTrashClick = () => {
    setCurrentView('trash');
    console.log("Mostrando lixeira");
  };

  const handleSharedClick = () => {
    setCurrentView('shared');
    console.log("Mostrando compartilhados");
  };

  const handleFavoritesClick = () => {
    setCurrentView('favorites');
    console.log("Mostrando favoritos");
  };

  const handleBackToFiles = () => {
    setCurrentView('files');
    console.log("Voltando aos arquivos");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <OneDiskSidebar
        usedSpace={usedSpace}
        totalSpace={totalSpace}
        objectsCount={objectsCount}
        currentPath={currentPath}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTrashClick={handleTrashClick}
        onSharedClick={handleSharedClick}
        onFavoritesClick={handleFavoritesClick}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <OneDiskToolbar
          bucketName="Meu Bucket"
          viewMode={viewMode}
          isInTrash={currentView === 'trash'}
          isInShared={currentView === 'shared'}
          isInFavorites={currentView === 'favorites'}
          onNavigateHome={() => handleNavigate('/')}
          onNavigateBack={() => console.log("Voltar")}
          onNavigateForward={() => console.log("Avançar")}
          onReload={handleReload}
          onCreateFolder={handleCreateFolder}
          onDelete={() => console.log("Delete")}
          onShare={() => console.log("Share")}
          onInfo={() => console.log("Info")}
          onViewModeChange={setViewMode}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <OneDiskFileArea
          files={currentFiles}
          viewMode={viewMode}
          selectedItems={selectedItems}
          editingFolderId={editingFolderId}
          isInTrash={currentView === 'trash'}
          isInShared={currentView === 'shared'}
          isInFavorites={currentView === 'favorites'}
          onFileClick={handleFileClick}
          onFavoriteToggle={handleFavoriteToggle}
          onShareClick={handleShareClick}
          onItemSelect={handleItemSelect}
          onSelectAll={() => {}}
          onFolderRename={handleFolderRename}
          onNavigateToFolder={handleNavigateToFolder}
        />
      </div>

      {shareModalItem && (
        <OneDiskShareModal
          fileName={shareModalItem.name}
          shareLink={`https://example.com/share/${shareModalItem.id}`}
          isOpen={!!shareModalItem}
          onClose={() => setShareModalItem(null)}
        />
      )}
    </div>
  );
}
