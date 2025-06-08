
import { useEffect } from 'react';
import { useKanban } from '../context/KanbanContext';
import { KanbanBoard, KanbanColumn, KanbanItem } from '../config';

export function useKanbanData(context: string, contextId: string) {
  const { state, dispatch } = useKanban();

  useEffect(() => {
    loadBoards(context, contextId);
  }, [context, contextId]);

  const loadBoards = async (context: string, contextId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulação de dados - em produção, seria uma chamada à API
      const mockBoards: KanbanBoard[] = [
        {
          id: `board-${context}-${contextId}`,
          title: `Quadro ${context.toUpperCase()}`,
          context,
          contextId,
          columns: [
            {
              id: 'col-1',
              title: 'A Fazer',
              color: '#f3f4f6',
              items: [
                {
                  id: 'item-1',
                  title: 'Tarefa de exemplo 1',
                  description: 'Descrição da tarefa',
                  priority: 'high',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            },
            {
              id: 'col-2',
              title: 'Em Progresso',
              color: '#fef3c7',
              items: [],
            },
            {
              id: 'col-3',
              title: 'Concluído',
              color: '#d1fae5',
              items: [],
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      dispatch({ type: 'SET_BOARDS', payload: mockBoards });
      dispatch({ type: 'SET_ACTIVE_BOARD', payload: mockBoards[0] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar quadros' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createBoard = (title: string) => {
    const newBoard: KanbanBoard = {
      id: `board-${Date.now()}`,
      title,
      context,
      contextId,
      columns: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOARD', payload: newBoard });
    return newBoard;
  };

  const addColumn = (boardId: string, title: string) => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title,
      items: [],
      color: '#f3f4f6',
    };
    dispatch({ type: 'ADD_COLUMN', payload: { boardId, column: newColumn } });
  };

  const addItem = (boardId: string, columnId: string, title: string, description?: string) => {
    const newItem: KanbanItem = {
      id: `item-${Date.now()}`,
      title,
      description,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ITEM', payload: { boardId, columnId, item: newItem } });
  };

  const moveItem = (boardId: string, itemId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    dispatch({
      type: 'MOVE_ITEM',
      payload: { boardId, itemId, fromColumnId, toColumnId, newIndex },
    });
  };

  const updateColumn = (boardId: string, column: KanbanColumn) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: { boardId, column } });
  };

  return {
    ...state,
    createBoard,
    addColumn,
    addItem,
    moveItem,
    updateColumn,
  };
}
