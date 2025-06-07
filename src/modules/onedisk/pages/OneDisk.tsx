
import { useState } from "react";
import { OneDiskToolbar } from "../components/OneDiskToolbar";
import { OneDiskSidebar } from "../components/OneDiskSidebar";
import { OneDiskFileArea } from "../components/OneDiskFileArea";
import { OneDiskFooter } from "../components/OneDiskFooter";
import { FileItem, BucketInfo } from "../config";

export default function OneDisk() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bucketInfo] = useState<BucketInfo>({
    id: "bucket-1",
    name: "Meu Bucket",
    uuid: "b8f3c4e2-9a7d-4e1f-8c6b-2d5a9e7f1b3c",
    currentPath: "/documentos/projetos",
    usedSpace: 45 * 1024 * 1024 * 1024, // 45GB
    totalSpace: 100 * 1024 * 1024 * 1024, // 100GB
    objectsCount: 1247
  });

  const [files] = useState<FileItem[]>([
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

  const handleFileClick = (file: FileItem) => {
    console.log("File clicked:", file.name);
  };

  const handleFavoriteToggle = (fileId: string) => {
    console.log("Toggle favorite:", fileId);
  };

  const handleShareClick = (fileId: string) => {
    console.log("Share file:", fileId);
  };

  const handlePathClick = (path: string) => {
    console.log("Navigate to path:", path);
  };

  return (
    <div className="h-full flex flex-col">
      <OneDiskToolbar
        bucketName={bucketInfo.name}
        viewMode={viewMode}
        onNavigateHome={() => console.log("Navigate home")}
        onNavigateBack={() => console.log("Navigate back")}
        onNavigateForward={() => console.log("Navigate forward")}
        onCreateFolder={() => console.log("Create folder")}
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
          onTrashClick={() => console.log("Show trash")}
          onSharedClick={() => console.log("Show shared")}
          onFavoritesClick={() => console.log("Show favorites")}
        />
        
        <div className="flex-1 flex flex-col">
          <OneDiskFileArea
            files={files}
            viewMode={viewMode}
            onFileClick={handleFileClick}
            onFavoriteToggle={handleFavoriteToggle}
            onShareClick={handleShareClick}
          />
          
          <OneDiskFooter
            currentPath={bucketInfo.currentPath}
            bucketUuid={bucketInfo.uuid}
            onPathClick={handlePathClick}
          />
        </div>
      </div>
    </div>
  );
}
