
import React, { useState, memo, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditText(data.text);
  }, [data.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    console.log('Starting edit mode for node:', id);
    setIsEditing(true);
    setEditText(data.text);
  };

  const finishEditing = () => {
    console.log('Finishing edit with text:', editText);
    if (editText.trim() && editText.trim() !== data.text) {
      onUpdateNode(id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    console.log('Canceling edit');
    setEditText(data.text);
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Double click detected on node:', id);
    startEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      console.log('Tab pressed, creating child node');
      finishEditing();
      setTimeout(() => {
        console.log('Calling onAddChild for:', id);
        onAddChild(id);
      }, 50);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleInputBlur = () => {
    console.log('Input blurred');
    finishEditing();
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit button clicked');
    startEditing();
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
            ref={inputRef}
            value={editText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="text-center border-none bg-transparent placeholder-white/70 focus:ring-0 focus:ring-offset-0"
            style={{ 
              color: data.color,
              fontSize: `${data.fontSize}px`,
              fontWeight: data.fontWeight
            }}
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
            onClick={handleEditButtonClick}
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
