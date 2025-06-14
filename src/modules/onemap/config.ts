
export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  isRoot: boolean;
  parentId?: string;
  children: string[];
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
}

export interface MindMap {
  id: string;
  name: string;
  description?: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  centerX: number;
  centerY: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const DEFAULT_NODE_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const DEFAULT_NODE_STYLE = {
  width: 120,
  height: 40,
  fontSize: 14,
  fontWeight: 'normal' as const,
  color: '#FFFFFF',
  backgroundColor: '#3B82F6',
};

export const CANVAS_CONFIG = {
  defaultWidth: 2000,
  defaultHeight: 1500,
  minZoom: 0.1,
  maxZoom: 3,
  gridSize: 20,
};
