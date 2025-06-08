
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { KanbanBoard, KanbanColumn, KanbanItem, KanbanContext } from '../config';

interface KanbanState extends KanbanContext {}

type KanbanAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BOARDS'; payload: KanbanBoard[] }
  | { type: 'SET_ACTIVE_BOARD'; payload: KanbanBoard | null }
  | { type: 'ADD_BOARD'; payload: KanbanBoard }
  | { type: 'UPDATE_BOARD'; payload: KanbanBoard }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'ADD_COLUMN'; payload: { boardId: string; column: KanbanColumn } }
  | { type: 'UPDATE_COLUMN'; payload: { boardId: string; column: KanbanColumn } }
  | { type: 'DELETE_COLUMN'; payload: { boardId: string; columnId: string } }
  | { type: 'ADD_ITEM'; payload: { boardId: string; columnId: string; item: KanbanItem } }
  | { type: 'UPDATE_ITEM'; payload: { boardId: string; item: KanbanItem } }
  | { type: 'MOVE_ITEM'; payload: { boardId: string; itemId: string; fromColumnId: string; toColumnId: string; newIndex: number } }
  | { type: 'DELETE_ITEM'; payload: { boardId: string; itemId: string } };

const initialState: KanbanState = {
  boards: [],
  activeBoard: null,
  isLoading: false,
  error: null,
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    
    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoard: action.payload };
    
    case 'ADD_BOARD':
      return { ...state, boards: [...state.boards, action.payload] };
    
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.id ? action.payload : board
        ),
        activeBoard: state.activeBoard?.id === action.payload.id ? action.payload : state.activeBoard,
      };
    
    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board.id !== action.payload),
        activeBoard: state.activeBoard?.id === action.payload ? null : state.activeBoard,
      };
    
    case 'ADD_COLUMN':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, columns: [...board.columns, action.payload.column] }
            : board
        ),
        activeBoard: state.activeBoard?.id === action.payload.boardId
          ? { ...state.activeBoard, columns: [...state.activeBoard.columns, action.payload.column] }
          : state.activeBoard,
      };
    
    case 'UPDATE_COLUMN':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                columns: board.columns.map(col =>
                  col.id === action.payload.column.id ? action.payload.column : col
                ),
              }
            : board
        ),
        activeBoard: state.activeBoard?.id === action.payload.boardId
          ? {
              ...state.activeBoard,
              columns: state.activeBoard.columns.map(col =>
                col.id === action.payload.column.id ? action.payload.column : col
              ),
            }
          : state.activeBoard,
      };
    
    case 'MOVE_ITEM':
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board.id !== action.payload.boardId) return board;
          
          const newColumns = board.columns.map(column => {
            if (column.id === action.payload.fromColumnId) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== action.payload.itemId),
              };
            }
            if (column.id === action.payload.toColumnId) {
              const item = board.columns
                .find(col => col.id === action.payload.fromColumnId)
                ?.items.find(item => item.id === action.payload.itemId);
              if (item) {
                const newItems = [...column.items];
                newItems.splice(action.payload.newIndex, 0, item);
                return { ...column, items: newItems };
              }
            }
            return column;
          });
          
          return { ...board, columns: newColumns };
        }),
        activeBoard: state.activeBoard?.id === action.payload.boardId
          ? {
              ...state.activeBoard,
              columns: state.activeBoard.columns.map(column => {
                if (column.id === action.payload.fromColumnId) {
                  return {
                    ...column,
                    items: column.items.filter(item => item.id !== action.payload.itemId),
                  };
                }
                if (column.id === action.payload.toColumnId) {
                  const item = state.activeBoard!.columns
                    .find(col => col.id === action.payload.fromColumnId)
                    ?.items.find(item => item.id === action.payload.itemId);
                  if (item) {
                    const newItems = [...column.items];
                    newItems.splice(action.payload.newIndex, 0, item);
                    return { ...column, items: newItems };
                  }
                }
                return column;
              }),
            }
          : state.activeBoard,
      };
    
    default:
      return state;
  }
}

interface KanbanContextType {
  state: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
