
import { useEffect } from 'react';
import { useOneboard } from '../context/OneboardContext';
import { Workspace, Board, Stage, Card } from '../config';

export function useOneboardData(workspaceId?: string, boardId?: string) {
  const { state, dispatch } = useOneboard();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (workspaceId) {
      setActiveWorkspace(workspaceId);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (boardId) {
      setActiveBoard(boardId);
    }
  }, [boardId]);

  const loadWorkspaces = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock data - em produção seria uma chamada à API
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'Projeto Alpha',
          description: 'Workspace principal do projeto Alpha',
          color: '#3b82f6',
          boards: [
            {
              id: 'board-1',
              title: 'Desenvolvimento',
              description: 'Quadro de desenvolvimento do projeto',
              workspaceId: '1',
              stages: [
                {
                  id: 'stage-1',
                  title: 'Backlog',
                  order: 1,
                  color: '#f3f4f6',
                  cards: [
                    {
                      id: 'card-1',
                      title: 'Implementar autenticação',
                      description: 'Criar sistema de login e registro',
                      priority: 'high',
                      assignee: 'João Silva',
                      tags: ['backend', 'auth'],
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                },
                {
                  id: 'stage-2',
                  title: 'Em Desenvolvimento',
                  order: 2,
                  color: '#fef3c7',
                  cards: [],
                },
                {
                  id: 'stage-3',
                  title: 'Em Revisão',
                  order: 3,
                  color: '#dbeafe',
                  cards: [],
                },
                {
                  id: 'stage-4',
                  title: 'Concluído',
                  order: 4,
                  color: '#d1fae5',
                  cards: [],
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Marketing',
          description: 'Workspace da equipe de marketing',
          color: '#10b981',
          boards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      dispatch({ type: 'SET_WORKSPACES', payload: mockWorkspaces });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar workspaces' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setActiveWorkspace = (workspaceId: string) => {
    const workspace = state.workspaces.find(w => w.id === workspaceId);
    dispatch({ type: 'SET_ACTIVE_WORKSPACE', payload: workspace || null });
  };

  const setActiveBoard = (boardId: string) => {
    const board = state.activeWorkspace?.boards.find(b => b.id === boardId);
    dispatch({ type: 'SET_ACTIVE_BOARD', payload: board || null });
  };

  const createBoard = (workspaceId: string, title: string, description?: string) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      description,
      workspaceId,
      stages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOARD', payload: { workspaceId, board: newBoard } });
    return newBoard;
  };

  const addStage = (boardId: string, title: string) => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      title,
      cards: [],
      color: '#f3f4f6',
      order: (state.activeBoard?.stages.length || 0) + 1,
    };
    dispatch({ type: 'ADD_STAGE', payload: { boardId, stage: newStage } });
  };

  const addCard = (boardId: string, stageId: string, title: string, description?: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CARD', payload: { boardId, stageId, card: newCard } });
  };

  const moveCard = (boardId: string, cardId: string, fromStageId: string, toStageId: string, newIndex: number) => {
    dispatch({
      type: 'MOVE_CARD',
      payload: { boardId, cardId, fromStageId, toStageId, newIndex },
    });
  };

  const updateBoard = (board: Board) => {
    dispatch({ type: 'UPDATE_BOARD', payload: board });
  };

  return {
    ...state,
    setActiveWorkspace,
    setActiveBoard,
    createBoard,
    addStage,
    addCard,
    moveCard,
    updateBoard,
  };
}
