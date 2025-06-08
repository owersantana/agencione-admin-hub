
export interface OneboardConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  routes: string[];
}

export const ONEBOARD_MODULE: OneboardConfig = {
  id: "oneboard",
  name: "Oneboard",
  description: "Sistema de quadros colaborativos organizados por workspaces",
  enabled: true,
  icon: "layout-dashboard",
  routes: ["/dashboard/oneboard"]
};

export interface Card {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  title: string;
  cards: Card[];
  color?: string;
  limit?: number;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  stages: Stage[];
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color?: string;
  boards: Board[];
  createdAt: string;
  updatedAt: string;
}

export interface OneboardStateData {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeBoard: Board | null;
  isLoading: boolean;
  error: string | null;
}
