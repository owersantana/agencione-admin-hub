
import React from 'react';
import { useParams } from 'react-router-dom';
import { OneboardProvider } from '../context/OneboardContext';
import { OneboardToolbar } from '../components/OneboardToolbar';
import { OneboardCanvas } from '../components/OneboardCanvas';
import { useOneboardData } from '../hooks/useOneboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function OneboardContent() {
  const { workspaceId, boardId } = useParams<{ workspaceId: string; boardId: string }>();
  const { 
    activeWorkspace, 
    activeBoard, 
    isLoading, 
    error, 
    updateBoard 
  } = useOneboardData(workspaceId, boardId);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-80 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!activeWorkspace || !activeBoard) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Workspace ou board não encontrado.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleBoardTitleChange = (title: string) => {
    updateBoard({ ...activeBoard, title });
  };

  const handleNewCard = () => {
    // Implementar modal de criação de card
    console.log('Novo card');
  };

  return (
    <div className="h-full flex flex-col">
      <OneboardToolbar
        workspace={activeWorkspace}
        board={activeBoard}
        onBoardTitleChange={handleBoardTitleChange}
        onWorkspaceChange={(workspaceId) => console.log('Change workspace:', workspaceId)}
        onNewCard={handleNewCard}
        onExport={() => console.log('Export')}
        onArchive={() => console.log('Archive')}
        onSettings={() => console.log('Settings')}
      />
      
      <OneboardCanvas
        board={activeBoard}
        onNewCard={handleNewCard}
      />
    </div>
  );
}

export default function Oneboard() {
  return (
    <OneboardProvider>
      <OneboardContent />
    </OneboardProvider>
  );
}
