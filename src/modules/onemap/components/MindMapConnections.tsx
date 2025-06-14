
import React from 'react';
import { MindMapConnection, MindMapNode } from '../config';

interface MindMapConnectionsProps {
  connections: MindMapConnection[];
  nodes: MindMapNode[];
}

export function MindMapConnections({ connections, nodes }: MindMapConnectionsProps) {
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    };
  };

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {connections.map((connection) => {
        const fromCenter = getNodeCenter(connection.fromNodeId);
        const toCenter = getNodeCenter(connection.toNodeId);
        
        // Simple curved line
        const controlPoint1X = fromCenter.x + (toCenter.x - fromCenter.x) * 0.5;
        const controlPoint1Y = fromCenter.y;
        const controlPoint2X = fromCenter.x + (toCenter.x - fromCenter.x) * 0.5;
        const controlPoint2Y = toCenter.y;

        const pathData = `M ${fromCenter.x} ${fromCenter.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${toCenter.x} ${toCenter.y}`;

        return (
          <path
            key={connection.id}
            d={pathData}
            fill="none"
            stroke={connection.color}
            strokeWidth={connection.thickness}
            strokeDasharray={connection.style === 'dashed' ? '5,5' : connection.style === 'dotted' ? '2,2' : 'none'}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}
