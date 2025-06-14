
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMap, MindMapNodeData, DEFAULT_NODE_COLORS } from '../config';
import { OneMapCanvasToolbar } from './OneMapCanvasToolbar';
import { MindMapFlowNode } from './MindMapFlowNode';

interface OneMapCanvasProps {
  map: MindMap | null;
  onMapUpdate: (map: MindMap) => void;
  onMapAction: (mapId: string, action: string) => void;
}

const nodeTypes: NodeTypes = {
  mindMapNode: MindMapFlowNode,
};

export function OneMapCanvas({ map, onMapUpdate, onMapAction }: OneMapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<MindMapNodeData>>(map?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(map?.connections || []);

  // Update local state when map changes
  React.useEffect(() => {
    if (map) {
      setNodes(map.nodes);
      setEdges(map.connections);
    }
  }, [map, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: crypto.randomUUID(),
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3B82F6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<MindMapNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates, updatedAt: new Date().toISOString() } }
          : node
      )
    );
  }, [setNodes]);

  const handleAddNode = useCallback((parentId?: string) => {
    const parentNode = parentId ? nodes.find(n => n.id === parentId) : null;
    const rootNode = nodes.find(n => n.data.isRoot);
    
    let x = 400;
    let y = 300;
    
    if (parentNode) {
      x = parentNode.position.x + 200;
      y = parentNode.position.y + (parentNode.data.children.length * 80);
    } else if (rootNode) {
      x = rootNode.position.x + 200;
      y = rootNode.position.y + (rootNode.data.children.length * 80);
    }

    const colorIndex = nodes.length % DEFAULT_NODE_COLORS.length;
    const backgroundColor = DEFAULT_NODE_COLORS[colorIndex];

    const newNode: Node<MindMapNodeData> = {
      id: crypto.randomUUID(),
      type: 'mindMapNode',
      position: { x, y },
      data: {
        text: 'Novo Nó',
        color: '#FFFFFF',
        backgroundColor,
        fontSize: 14,
        fontWeight: 'normal',
        isRoot: false,
        parentId: parentId || rootNode?.id,
        children: [],
        isExpanded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];
      
      // Update parent's children list
      if (parentId || rootNode) {
        const targetParentId = parentId || rootNode!.id;
        return updatedNodes.map((node) =>
          node.id === targetParentId
            ? { ...node, data: { ...node.data, children: [...node.data.children, newNode.id] } }
            : node
        );
      }
      
      return updatedNodes;
    });

    // Create connection to parent
    if (parentId || rootNode) {
      const targetParentId = parentId || rootNode!.id;
      const newEdge: Edge = {
        id: crypto.randomUUID(),
        source: targetParentId,
        target: newNode.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: backgroundColor, strokeWidth: 2 },
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [nodes, setNodes, setEdges]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (!nodeToDelete || nodeToDelete.data.isRoot) {
      if (nodeToDelete?.data.isRoot) {
        alert('Não é possível excluir o nó raiz');
      }
      return;
    }

    // Remove node and its connections
    setNodes((nds) => 
      nds.filter(n => n.id !== nodeId).map(node => ({
        ...node,
        data: {
          ...node.data,
          children: node.data.children.filter(childId => childId !== nodeId),
        }
      }))
    );
    
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, [nodes, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    if (!map) return;
    
    const updatedMap: MindMap = {
      ...map,
      nodes: nodes as Node<MindMapNodeData>[],
      connections: edges.map(edge => ({ ...edge, thickness: 2 })),
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
  }, [map, nodes, edges, onMapUpdate]);

  // Enhanced node types with our custom props
  const enhancedNodeTypes = useMemo(() => ({
    mindMapNode: (props: any) => (
      <MindMapFlowNode
        {...props}
        onAddChild={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onUpdateNode={handleNodeUpdate}
      />
    ),
  }), [handleAddNode, handleDeleteNode, handleNodeUpdate]);

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <OneMapCanvasToolbar
        zoom={1}
        onZoom={() => {}}
        onAddNode={() => handleAddNode()}
        onSave={handleSave}
        selectedNodeId={null}
        onDeleteNode={undefined}
      />

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={enhancedNodeTypes}
          fitView
          attributionPosition="top-right"
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant="cross" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
