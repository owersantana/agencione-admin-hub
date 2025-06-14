
import React, { useState, useRef, useEffect } from 'react';
import { MindMap, MindMapNode } from '../config';
import { OneMapCanvasToolbar } from './OneMapCanvasToolbar';
import { MindMapNodeComponent } from './MindMapNodeComponent';
import { MindMapConnections } from './MindMapConnections';

interface OneMapCanvasProps {
  map: MindMap | null;
  onMapUpdate: (map: MindMap) => void;
  onMapAction: (mapId: string, action: string) => void;
}

export function OneMapCanvas({ map, onMapUpdate, onMapAction }: OneMapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);

  useEffect(() => {
    if (map) {
      setZoom(map.zoom);
      setPan({ x: map.centerX, y: map.centerY });
    }
  }, [map]);

  if (!map) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium">Selecione um mapa mental</div>
          <p className="text-sm text-muted-foreground">
            Escolha um mapa da lista ou crie um novo
          </p>
        </div>
      </div>
    );
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedNodeId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<MindMapNode>) => {
    const updatedNodes = map.nodes.map(node =>
      node.id === nodeId ? { ...node, ...updates, updatedAt: new Date().toISOString() } : node
    );
    
    const updatedMap = {
      ...map,
      nodes: updatedNodes,
      zoom,
      centerX: pan.x,
      centerY: pan.y,
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
  };

  const handleAddNode = (parentId?: string) => {
    const parentNode = parentId ? map.nodes.find(n => n.id === parentId) : null;
    const rootNode = map.nodes.find(n => n.isRoot);
    
    let x = 400;
    let y = 300;
    
    if (parentNode) {
      // Posicionar próximo ao nó pai
      x = parentNode.x + 200;
      y = parentNode.y + (parentNode.children.length * 60);
    } else if (rootNode) {
      // Posicionar próximo à raiz
      x = rootNode.x + 200;
      y = rootNode.y + (rootNode.children.length * 60);
    }

    const newNode: MindMapNode = {
      id: crypto.randomUUID(),
      text: 'Novo Nó',
      x,
      y,
      width: 120,
      height: 40,
      color: '#FFFFFF',
      backgroundColor: '#3B82F6',
      fontSize: 14,
      fontWeight: 'normal',
      isRoot: false,
      parentId: parentId || rootNode?.id,
      children: [],
      isExpanded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNodes = [...map.nodes, newNode];
    
    // Adicionar à lista de filhos do pai
    if (parentId || rootNode) {
      const targetParentId = parentId || rootNode!.id;
      const parentIndex = updatedNodes.findIndex(n => n.id === targetParentId);
      if (parentIndex !== -1) {
        updatedNodes[parentIndex] = {
          ...updatedNodes[parentIndex],
          children: [...updatedNodes[parentIndex].children, newNode.id],
        };
      }
    }

    // Criar conexão se há um pai
    const updatedConnections = [...map.connections];
    if (parentId || rootNode) {
      const targetParentId = parentId || rootNode!.id;
      updatedConnections.push({
        id: crypto.randomUUID(),
        fromNodeId: targetParentId,
        toNodeId: newNode.id,
        color: newNode.backgroundColor,
        style: 'solid',
        thickness: 2,
      });
    }

    const updatedMap = {
      ...map,
      nodes: updatedNodes,
      connections: updatedConnections,
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (map.nodes.find(n => n.id === nodeId)?.isRoot) {
      alert('Não é possível excluir o nó raiz');
      return;
    }

    // Remover nó e suas conexões
    const updatedNodes = map.nodes.filter(n => n.id !== nodeId);
    const updatedConnections = map.connections.filter(c => 
      c.fromNodeId !== nodeId && c.toNodeId !== nodeId
    );

    // Remover das listas de filhos dos pais
    const finalNodes = updatedNodes.map(node => ({
      ...node,
      children: node.children.filter(childId => childId !== nodeId),
    }));

    const updatedMap = {
      ...map,
      nodes: finalNodes,
      connections: updatedConnections,
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
    setSelectedNodeId(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <OneMapCanvasToolbar
        zoom={zoom}
        onZoom={handleZoom}
        onAddNode={() => handleAddNode()}
        onSave={() => {}}
        selectedNodeId={selectedNodeId}
        onDeleteNode={selectedNodeId ? () => handleDeleteNode(selectedNodeId) : undefined}
      />

      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gray-50 cursor-move"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Canvas Content */}
        <div 
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connections */}
          <MindMapConnections 
            connections={map.connections}
            nodes={map.nodes}
          />

          {/* Nodes */}
          {map.nodes.map((node) => (
            <MindMapNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => handleNodeSelect(node.id)}
              onUpdate={(updates) => handleNodeUpdate(node.id, updates)}
              onAddChild={() => handleAddNode(node.id)}
              onDelete={() => handleDeleteNode(node.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
