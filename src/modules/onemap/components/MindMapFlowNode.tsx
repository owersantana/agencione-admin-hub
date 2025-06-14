
import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
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
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditText(data.text);
  }, [data.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 10);
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    console.log('Starting edit mode for node:', id);
    setIsEditing(true);
    setEditText(data.text);
  }, [id, data.text]);

  const finishEditing = useCallback(() => {
    console.log('Finishing edit with text:', editText);
    if (editText.trim() && editText.trim() !== data.text) {
      onUpdateNode(id, { text: editText.trim() });
    }
    setIsEditing(false);
  }, [editText, data.text, onUpdateNode, id]);

  const cancelEditing = useCallback(() => {
    console.log('Canceling edit');
    setEditText(data.text);
    setIsEditing(false);
  }, [data.text]);

  const handleNodeDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Node double click detected');
    if (!isEditing) {
      startEditing();
    }
  }, [isEditing, startEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed in input:', e.key);
    
    // Prevent ReactFlow from handling these keys
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      console.log('Tab pressed - creating child node');
      finishEditing();
      // Create child node after a small delay
      setTimeout(() => {
        console.log('Executing onAddChild for node:', id);
        onAddChild(id);
      }, 100);
    }
  }, [finishEditing, cancelEditing, onAddChild, id]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    console.log('Input lost focus');
    // Only finish editing if we're not clicking on another part of our node
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!nodeRef.current?.contains(relatedTarget)) {
      finishEditing();
    }
  }, [finishEditing]);

  const handleEditButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit button clicked');
    startEditing();
  }, [startEditing]);

  const handleAddChildClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add child button clicked');
    onAddChild(id);
  }, [onAddChild, id]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked');
    onDeleteNode(id);
  }, [onDeleteNode, id]);

  const handleToggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle expanded clicked');
    onToggleExpanded(id);
  }, [onToggleExpanded, id]);

  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="relative group" ref={nodeRef}>
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
          hover:shadow-lg transition-shadow
          ${!isEditing ? 'cursor-pointer' : ''}
        `}
        style={{
          backgroundColor: data.backgroundColor || '#3B82F6',
          color: data.color || '#FFFFFF',
          fontSize: `${data.fontSize || 14}px`,
          fontWeight: data.fontWeight || 'normal',
        }}
        onDoubleClick={handleNodeDoubleClick}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="text-center border-none bg-transparent placeholder-white/70 focus:ring-0 focus:ring-offset-0 focus:outline-none"
            style={{ 
              color: data.color || '#FFFFFF',
              fontSize: `${data.fontSize || 14}px`,
              fontWeight: data.fontWeight || 'normal'
            }}
            placeholder="Digite Tab para criar nó filho"
          />
        ) : (
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={handleToggleExpanded}
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
            onClick={handleAddChildClick}
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
              onClick={handleDeleteClick}
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
