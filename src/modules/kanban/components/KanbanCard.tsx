
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KanbanItem } from '../config';
import { Calendar, User, MoreHorizontal, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanCardProps {
  item: KanbanItem;
  onEdit?: (item: KanbanItem) => void;
  onDelete?: (itemId: string) => void;
  isDragging?: boolean;
}

export function KanbanCard({ item, onEdit, onDelete, isDragging }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      draggable
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-foreground line-clamp-2">
            {item.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(item)}>
                <Edit2 size={14} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(item.id)}
                className="text-destructive"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {item.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {item.priority && (
            <Badge variant="secondary" className={`text-xs ${getPriorityColor(item.priority)}`}>
              {item.priority.toUpperCase()}
            </Badge>
          )}
          {item.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {item.assignee && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{item.assignee}</span>
            </div>
          )}
          {item.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(item.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
