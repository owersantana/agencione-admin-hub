
import React, { useState } from 'react';
import { Card as UICard, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '../config';
import { Calendar, User, MoreHorizontal, Edit2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface OneboardCardProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  isDragging?: boolean;
}

export function OneboardCard({ card, onEdit, onDelete, isDragging }: OneboardCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <UICard 
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all hover:shadow-md group",
        isDragging && "opacity-50 rotate-2",
        isOverdue && "border-destructive/50"
      )}
      draggable
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 flex-1">
            {card.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(card)}>
                <Edit2 size={14} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(card.id)}
                className="text-destructive"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {card.description}
          </p>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs py-0">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="outline" className="text-xs py-0">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Priority */}
        {card.priority && (
          <Badge 
            variant="secondary" 
            className={cn("text-xs w-fit", getPriorityColor(card.priority))}
          >
            {card.priority.toUpperCase()}
          </Badge>
        )}

        {/* Footer with assignee and due date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          {card.assignee && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="truncate max-w-20">{card.assignee}</span>
            </div>
          )}
          
          {card.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              isOverdue && "text-destructive"
            )}>
              {isOverdue ? <Clock size={12} /> : <Calendar size={12} />}
              <span>{new Date(card.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </UICard>
  );
}
