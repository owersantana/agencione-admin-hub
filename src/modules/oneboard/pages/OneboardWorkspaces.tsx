
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { useOneboardData } from '../hooks/useOneboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LayoutDashboard, Calendar, Users } from 'lucide-react';

export default function OneboardWorkspaces() {
  const navigate = useNavigate();
  const { workspaces, isLoading, error, createBoard } = useOneboardData();

  const handleBoardClick = (workspaceId: string, boardId: string) => {
    navigate(`/dashboard/oneboard/${workspaceId}/${boardId}`);
  };

  const handleCreateBoard = (workspaceId: string, title: string, description?: string) => {
    const newBoard = createBoard(workspaceId, title, description);
    if (newBoard) {
      navigate(`/dashboard/oneboard/${workspaceId}/${newBoard.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Oneboard - Workspaces</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: workspace.color }}
                  />
                  {workspace.name}
                </CardTitle>
                <CreateBoardModal
                  workspaceId={workspace.id}
                  onCreateBoard={handleCreateBoard}
                />
              </div>
              {workspace.description && (
                <p className="text-sm text-muted-foreground">
                  {workspace.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    {workspace.boards.length} boards
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(workspace.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {workspace.boards.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Boards:</h4>
                    <div className="space-y-2">
                      {workspace.boards.map((board) => (
                        <div
                          key={board.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                          onClick={() => handleBoardClick(workspace.id, board.id)}
                        >
                          <div>
                            <h5 className="text-sm font-medium">{board.title}</h5>
                            {board.description && (
                              <p className="text-xs text-muted-foreground">
                                {board.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {board.stages.length} stages
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Nenhum board criado ainda
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workspaces.length === 0 && (
        <div className="text-center py-12">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum workspace encontrado</h3>
          <p className="text-muted-foreground">
            Aguarde enquanto carregamos seus workspaces...
          </p>
        </div>
      )}
    </div>
  );
}
