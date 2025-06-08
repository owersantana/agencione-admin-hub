
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  path: string;
}

interface OneDiskFileTreeSidebarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function OneDiskFileTreeSidebar({ onNavigate, currentPath }: OneDiskFileTreeSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['/']);

  // Mock data - em produção viria da API
  const treeData: TreeNode[] = [
    {
      id: 'root',
      name: 'Meu Bucket',
      type: 'folder',
      path: '/',
      children: [
        {
          id: 'documentos',
          name: 'Documentos',
          type: 'folder',
          path: '/documentos',
          children: [
            {
              id: 'projetos',
              name: 'Projetos',
              type: 'folder',
              path: '/documentos/projetos',
              children: [
                { id: 'imagens', name: 'Imagens', type: 'folder', path: '/documentos/projetos/imagens' },
                { id: 'relatorio', name: 'Relatório Mensal.pdf', type: 'file', path: '/documentos/projetos/relatorio.pdf' }
              ]
            }
          ]
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          path: '/downloads',
          children: []
        }
      ]
    }
  ];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedFolders.includes(node.id);
    const isActive = currentPath === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 text-sm hover:bg-sidebar-accent rounded cursor-pointer",
            isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
          )}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              if (hasChildren) {
                toggleFolder(node.id);
              }
              onNavigate(node.path);
            }
          }}
        >
          {node.type === 'folder' && hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          
          <span className="truncate flex-1">{node.name}</span>
        </div>

        {node.type === 'folder' && hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-sidebar-foreground mb-2">Árvore de Arquivos</h3>
      <div className="space-y-1">
        {treeData.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
}
