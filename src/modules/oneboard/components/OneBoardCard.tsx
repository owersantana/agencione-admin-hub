
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Share, Edit, Power } from 'lucide-react';
import { Board } from '../config';

interface OneBoardCardProps {
  board: Board;
  onAction: (boardId: string, action: string) => void;
}

export function OneBoardCard({ board, onAction }: OneBoardCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2 flex-1 min-w-0">
            {board.name}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
            {board.isShared && (
              <Badge variant="secondary" className="text-xs">
                Compartilhado
              </Badge>
            )}
            <Badge 
              variant={board.isActive ? "default" : "outline"}
              className="text-xs"
            >
              {board.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {board.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{board.columnsCount} colunas</span>
          <span className="hidden sm:inline">Criado em {formatDate(board.createdAt)}</span>
          <span className="sm:hidden">
            {formatDate(board.createdAt).split('/').slice(0, 2).join('/')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border">
        <div className="flex items-center justify-center gap-1 w-full">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(board.id, 'view')}
            className="h-8 px-2 flex-1 sm:flex-none"
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(board.id, 'edit')}
            className="h-8 px-2"
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(board.id, 'share')}
            className="h-8 px-2"
          >
            <Share className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(board.id, 'toggle-active')}
            className="h-8 px-2"
          >
            <Power className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(board.id, 'delete')}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
