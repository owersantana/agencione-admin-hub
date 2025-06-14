
import React, { useState, memo, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { MindMapNodeData } from '../config';

interface MindMapFlowNodeProps extends NodeProps {
  data: MindMapNodeData;
  onAddChild: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<MindMapNodeData>) => void;
  onToggleExpanded: (nodeId: string) => void;
}

export const MindMapFlowNode = memo(({
  id,
  data,
  selected,
  onAddChild,
  onDeleteNode,
  onUpdateNode,
  onToggleExpanded,
}: MindMapFlowNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);

  // Update editText when data.text changes
  useEffect(() => {
    setEditText(data.text);
  }, [data.text]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Double click detected, starting edit mode');
    setIsEditing(true);
    setEditText(data.text);
  };

  const handleEditSubmit = () => {
    console.log('Submitting edit:', editText);
    if (editText.trim()) {
      onUpdateNode(id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    e.stopPropagation(); // Prevent event from bubbling up
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditText(data.text);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      console.log('Tab pressed, creating child node');
      handleEditSubmit();
      // Use a longer timeout to ensure the edit is saved first
      setTimeout(() => {
        console.log('Calling onAddChild for:', id);
        onAddChild(id);
      }, 100);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit button clicked');
    setIsEditing(true);
    setEditText(data.text);
  };

  const handleInputBlur = () => {
    console.log('Input blurred, submitting edit');
    handleEditSubmit();
  };

  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="relative group">
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !border-gray-600" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !border-gray-600" />
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !border-gray-600" />
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !border-gray-600" />

      {/* Node Content */}
      <div
        className={`
          rounded-lg shadow-md border-2 flex items-center justify-center p-3 min-w-[120px] min-h-[40px]
          ${selected ? 'border-blue-500' : 'border-transparent'}
          ${data.isRoot ? 'shadow-lg' : 'shadow-md'}
          hover:shadow-lg transition-shadow cursor-pointer
        `}
        style={{
          backgroundColor: data.backgroundColor,
          color: data.color,
          fontSize: `${data.fontSize}px`,
          fontWeight: data.fontWeight,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleEditKeyDown}
            className="text-center border-none bg-transparent text-white placeholder-white/70"
            style={{ color: data.color }}
            autoFocus
            placeholder="Digite Tab para criar nó filho"
          />
        ) : (
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpanded(id);
                }}
                className="text-current opacity-70 hover:opacity-100"
              >
                {data.isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </button>
            )}
            <span className="text-center break-words px-2">{data.text}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selected && !isEditing && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0"
            onClick={handleEditClick}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          {!data.isRoot && (
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

MindMapFlowNode.displayName = 'MindMapFlowNode';
