
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Workspace, Board, Stage, Card, OneboardStateData } from '../config';

interface OneboardState extends OneboardStateData {}

type OneboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKSPACES'; payload: Workspace[] }
  | { type: 'SET_ACTIVE_WORKSPACE'; payload: Workspace | null }
  | { type: 'SET_ACTIVE_BOARD'; payload: Board | null }
  | { type: 'ADD_WORKSPACE'; payload: Workspace }
  | { type: 'UPDATE_WORKSPACE'; payload: Workspace }
  | { type: 'DELETE_WORKSPACE'; payload: string }
  | { type: 'ADD_BOARD'; payload: { workspaceId: string; board: Board } }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: { workspaceId: string; boardId: string } }
  | { type: 'ADD_STAGE'; payload: { boardId: string; stage: Stage } }
  | { type: 'UPDATE_STAGE'; payload: { boardId: string; stage: Stage } }
  | { type: 'DELETE_STAGE'; payload: { boardId: string; stageId: string } }
  | { type: 'ADD_CARD'; payload: { boardId: string; stageId: string; card: Card } }
  | { type: 'UPDATE_CARD'; payload: { boardId: string; card: Card } }
  | { type: 'MOVE_CARD'; payload: { boardId: string; cardId: string; fromStageId: string; toStageId: string; newIndex: number } }
  | { type: 'DELETE_CARD'; payload: { boardId: string; cardId: string } };

const initialState: OneboardState = {
  workspaces: [],
  activeWorkspace: null,
  activeBoard: null,
  isLoading: false,
  error: null,
};

function oneboardReducer(state: OneboardState, action: OneboardAction): OneboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_WORKSPACES':
      return { ...state, workspaces: action.payload };
    
    case 'SET_ACTIVE_WORKSPACE':
      return { ...state, activeWorkspace: action.payload };
    
    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoard: action.payload };
    
    case 'ADD_WORKSPACE':
      return { ...state, workspaces: [...state.workspaces, action.payload] };
    
    case 'UPDATE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace =>
          workspace.id === action.payload.id ? action.payload : workspace
        ),
        activeWorkspace: state.activeWorkspace?.id === action.payload.id ? action.payload : state.activeWorkspace,
      };
    
    case 'DELETE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.filter(workspace => workspace.id !== action.payload),
        activeWorkspace: state.activeWorkspace?.id === action.payload ? null : state.activeWorkspace,
      };
    
    case 'ADD_BOARD':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace =>
          workspace.id === action.payload.workspaceId
            ? { ...workspace, boards: [...workspace.boards, action.payload.board] }
            : workspace
        ),
        activeWorkspace: state.activeWorkspace?.id === action.payload.workspaceId
          ? { ...state.activeWorkspace, boards: [...state.activeWorkspace.boards, action.payload.board] }
          : state.activeWorkspace,
      };
    
    case 'UPDATE_BOARD':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace => ({
          ...workspace,
          boards: workspace.boards.map(board =>
            board.id === action.payload.id ? action.payload : board
          ),
        })),
        activeWorkspace: state.activeWorkspace ? {
          ...state.activeWorkspace,
          boards: state.activeWorkspace.boards.map(board =>
            board.id === action.payload.id ? action.payload : board
          ),
        } : null,
        activeBoard: state.activeBoard?.id === action.payload.id ? action.payload : state.activeBoard,
      };
    
    case 'MOVE_CARD':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace => ({
          ...workspace,
          boards: workspace.boards.map(board => {
            if (board.id !== action.payload.boardId) return board;
            
            const newStages = board.stages.map(stage => {
              if (stage.id === action.payload.fromStageId) {
                return {
                  ...stage,
                  cards: stage.cards.filter(card => card.id !== action.payload.cardId),
                };
              }
              if (stage.id === action.payload.toStageId) {
                const card = board.stages
                  .find(s => s.id === action.payload.fromStageId)
                  ?.cards.find(c => c.id === action.payload.cardId);
                if (card) {
                  const newCards = [...stage.cards];
                  newCards.splice(action.payload.newIndex, 0, card);
                  return { ...stage, cards: newCards };
                }
              }
              return stage;
            });
            
            return { ...board, stages: newStages };
          }),
        })),
        activeBoard: state.activeBoard?.id === action.payload.boardId
          ? {
              ...state.activeBoard,
              stages: state.activeBoard.stages.map(stage => {
                if (stage.id === action.payload.fromStageId) {
                  return {
                    ...stage,
                    cards: stage.cards.filter(card => card.id !== action.payload.cardId),
                  };
                }
                if (stage.id === action.payload.toStageId) {
                  const card = state.activeBoard!.stages
                    .find(s => s.id === action.payload.fromStageId)
                    ?.cards.find(c => c.id === action.payload.cardId);
                  if (card) {
                    const newCards = [...stage.cards];
                    newCards.splice(action.payload.newIndex, 0, card);
                    return { ...stage, cards: newCards };
                  }
                }
                return stage;
              }),
            }
          : state.activeBoard,
      };
    
    default:
      return state;
  }
}

interface OneboardContextType {
  state: OneboardState;
  dispatch: React.Dispatch<OneboardAction>;
}

const OneboardContext = createContext<OneboardContextType | undefined>(undefined);

export function OneboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(oneboardReducer, initialState);

  return (
    <OneboardContext.Provider value={{ state, dispatch }}>
      {children}
    </OneboardContext.Provider>
  );
}

export function useOneboard() {
  const context = useContext(OneboardContext);
  if (context === undefined) {
    throw new Error('useOneboard must be used within a OneboardProvider');
  }
  return context;
}
