
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { MindMapNode } from '../config';

interface MindMapNodeComponentProps {
  node: MindMapNode;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<MindMapNode>) => void;
  onAddChild: () => void;
  onDelete: () => void;
}

export function MindMapNodeComponent({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onAddChild,
  onDelete,
}: MindMapNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(node.text);
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onUpdate({ text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(node.text);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - node.x, 
      y: e.clientY - node.y 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isEditing) {
      onUpdate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-pointer select-none group ${
        isSelected ? 'z-10' : 'z-0'
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        minHeight: node.height,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Node Content */}
      <div
        className={`
          w-full h-full rounded-lg shadow-md border-2 flex items-center justify-center p-2
          ${isSelected ? 'border-blue-500' : 'border-transparent'}
          ${node.isRoot ? 'shadow-lg' : 'shadow-md'}
          hover:shadow-lg transition-shadow
        `}
        style={{
          backgroundColor: node.backgroundColor,
          color: node.color,
          fontSize: `${node.fontSize}px`,
          fontWeight: node.fontWeight,
        }}
      >
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            className="text-center border-none bg-transparent"
            style={{ color: node.color }}
            autoFocus
          />
        ) : (
          <span className="text-center break-words">{node.text}</span>
        )}
      </div>

      {/* Action Buttons */}
      {isSelected && !isEditing && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild();
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          {!node.isRoot && (
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
