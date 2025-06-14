import React, { useCallback, useMemo, useState } from 'react';
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
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMap, MindMapNodeData, DEFAULT_NODE_COLORS } from '../config';
import { OneMapCanvasToolbar } from './OneMapCanvasToolbar';
import { MindMapFlowNode } from './MindMapFlowNode';
import { useToast } from '@/hooks/use-toast';

interface OneMapCanvasProps {
  map: MindMap | null;
  onMapUpdate: (map: MindMap) => void;
  onMapAction: (mapId: string, action: string) => void;
}

const nodeTypes: NodeTypes = {
  mindMapNode: MindMapFlowNode,
};

export function OneMapCanvas({ map, onMapUpdate, onMapAction }: OneMapCanvasProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Ensure all nodes have proper position properties
  const initialNodes = useMemo(() => {
    if (!map?.nodes) return [];
    return map.nodes.map(node => ({
      ...node,
      position: node.position || { x: 400, y: 300 }
    }));
  }, [map?.nodes]);

  const initialEdges = useMemo(() => {
    if (!map?.connections) return [];
    return map.connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: conn.type || 'smoothstep',
      animated: conn.animated || false,
      style: conn.style || { stroke: '#3B82F6', strokeWidth: 2 },
    }));
  }, [map?.connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<MindMapNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Update local state when map changes
  React.useEffect(() => {
    if (map) {
      const safeNodes = map.nodes.map(node => ({
        ...node,
        position: node.position || { x: 400, y: 300 }
      }));
      setNodes(safeNodes);
      
      const safeEdges = map.connections?.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: conn.type || 'smoothstep',
        animated: conn.animated || false,
        style: conn.style || { stroke: '#3B82F6', strokeWidth: 2 },
      })) || [];
      setEdges(safeEdges);
    }
  }, [map, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      const newEdge: Edge = {
        ...params,
        id: crypto.randomUUID(),
        type: 'smoothstep',
        animated: true,
        style: { stroke: sourceNode.data.backgroundColor, strokeWidth: 2 },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: "Conexão criada",
        description: `Nós conectados com sucesso!`,
      });
    },
    [nodes, setEdges, toast]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isConnecting) {
      if (!selectedNodeId) {
        setSelectedNodeId(node.id);
        toast({
          title: "Nó selecionado",
          description: "Clique em outro nó para criar a conexão",
        });
      } else if (selectedNodeId !== node.id) {
        // Create connection
        const params: Connection = {
          source: selectedNodeId,
          target: node.id,
        };
        onConnect(params);
        setSelectedNodeId(null);
        setIsConnecting(false);
      }
    } else {
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    }
  }, [isConnecting, selectedNodeId, onConnect, toast]);

  const handleToggleConnect = useCallback(() => {
    setIsConnecting(!isConnecting);
    setSelectedNodeId(null);
    
    if (!isConnecting) {
      toast({
        title: "Modo de conexão ativado",
        description: "Clique em dois nós para conectá-los",
      });
    } else {
      toast({
        title: "Modo de conexão desativado",
        description: "",
      });
    }
  }, [isConnecting, toast]);

  // Update local state when map changes
  React.useEffect(() => {
    if (map) {
      const safeNodes = map.nodes.map(node => ({
        ...node,
        position: node.position || { x: 400, y: 300 }
      }));
      setNodes(safeNodes);
      
      const safeEdges = map.connections?.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: conn.type || 'smoothstep',
        animated: conn.animated || false,
        style: conn.style || { stroke: '#3B82F6', strokeWidth: 2 },
      })) || [];
      setEdges(safeEdges);
    }
  }, [map, setNodes, setEdges]);

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
    
    if (parentNode && parentNode.position) {
      x = parentNode.position.x + 200;
      y = parentNode.position.y + (parentNode.data.children.length * 80);
    } else if (rootNode && rootNode.position) {
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
    
    toast({
      title: "Nó adicionado",
      description: "Novo nó criado com sucesso!",
    });
  }, [nodes, setNodes, setEdges, toast]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (!nodeToDelete || nodeToDelete.data.isRoot) {
      if (nodeToDelete?.data.isRoot) {
        toast({
          title: "Erro",
          description: "Não é possível excluir o nó raiz",
          variant: "destructive",
        });
      }
      return;
    }

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
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    
    toast({
      title: "Nó removido",
      description: "Nó excluído com sucesso!",
    });
  }, [nodes, setNodes, setEdges, selectedNodeId, toast]);

  const handleSave = useCallback(() => {
    if (!map) return;
    
    const updatedMap: MindMap = {
      ...map,
      nodes: nodes as Node<MindMapNodeData>[],
      connections: edges.map(edge => ({ 
        ...edge, 
        thickness: 2,
        type: edge.type || 'smoothstep',
        style: edge.style || { stroke: '#3B82F6', strokeWidth: 2 }
      })),
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
    
    toast({
      title: "Mapa salvo",
      description: "Suas alterações foram salvas com sucesso!",
    });
  }, [map, nodes, edges, onMapUpdate, toast]);

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
        selectedNodeId={selectedNodeId}
        onDeleteNode={selectedNodeId ? () => handleDeleteNode(selectedNodeId) : undefined}
        isConnecting={isConnecting}
        onToggleConnect={handleToggleConnect}
      />

      <div className="flex-1">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            style: {
              ...node.style,
              border: selectedNodeId === node.id ? '2px solid #3B82F6' : node.style?.border,
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={enhancedNodeTypes}
          fitView
          attributionPosition="top-right"
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
