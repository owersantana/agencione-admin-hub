
import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { MindMapNodeData } from '../config';

interface MindMapFlowNodeProps extends NodeProps {
  data: MindMapNodeData;
  onAddChild: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<MindMapNodeData>) => void;
}

export const MindMapFlowNode = memo(({
  id,
  data,
  selected,
  onAddChild,
  onDeleteNode,
  onUpdateNode,
}: MindMapFlowNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(data.text);
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onUpdateNode(id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.text);
    }
  };

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
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            className="text-center border-none bg-transparent text-white placeholder-white/70"
            style={{ color: data.color }}
            autoFocus
          />
        ) : (
          <span className="text-center break-words px-2">{data.text}</span>
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
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
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
