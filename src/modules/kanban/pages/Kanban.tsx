
import React from 'react';
import { useParams } from 'react-router-dom';
import { KanbanProvider } from '../context/KanbanContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { useKanbanData } from '../hooks/useKanbanData';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function KanbanContent() {
  const { contexto, id } = useParams<{ contexto: string; id: string }>();
  const { activeBoard, isLoading, error } = useKanbanData(contexto || '', id || '');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
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

  if (!activeBoard) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum quadro encontrado para este contexto.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <KanbanBoard
        context={contexto || ''}
        contextId={id || ''}
        board={activeBoard}
      />
    </div>
  );
}

export default function Kanban() {
  return (
    <KanbanProvider>
      <KanbanContent />
    </KanbanProvider>
  );
}
