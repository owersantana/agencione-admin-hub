
export interface KanbanConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  routes: string[];
}

export const KANBAN_MODULE: KanbanConfig = {
  id: "kanban",
  name: "Kanban",
  description: "Sistema de quadros Kanban para gestão de projetos",
  enabled: true,
  icon: "kanban-square",
  routes: ["/dashboard/kanban"]
};

export interface KanbanItem {
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

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
  limit?: number;
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
  context: string;
  contextId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanStateData {
  boards: KanbanBoard[];
  activeBoard: KanbanBoard | null;
  isLoading: boolean;
  error: string | null;
}
