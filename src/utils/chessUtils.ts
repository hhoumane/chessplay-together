import { Board, ChessPiece, Position } from "@/types/chess";

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }

  // Place other pieces
  const pieceOrder: Array<ChessPiece['type']> = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieceOrder[i], color: 'black' };
    board[7][i] = { type: pieceOrder[i], color: 'white' };
  }

  return board;
};

export const isValidMove = (
  from: Position,
  to: Position,
  piece: ChessPiece,
  board: Board,
  currentTurn: 'white' | 'black'
): boolean => {
  if (piece.color !== currentTurn) return false;
  if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;
  
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === piece.color) return false;

  // Basic movement rules for each piece type
  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Moving forward
      if (to.col === from.col && !targetPiece) {
        if (to.row === from.row + direction) return true;
        if (from.row === startRow && to.row === from.row + 2 * direction && !board[from.row + direction][from.col]) {
          return true;
        }
      }
      
      // Capturing
      if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction && targetPiece) {
        return true;
      }
      
      return false;
    }
    
    case 'rook': {
      return from.row === to.row || from.col === to.col;
    }
    
    case 'knight': {
      const rowDiff = Math.abs(to.row - from.row);
      const colDiff = Math.abs(to.col - from.col);
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    
    case 'bishop': {
      return Math.abs(to.row - from.row) === Math.abs(to.col - from.col);
    }
    
    case 'queen': {
      return from.row === to.row || from.col === to.col || 
             Math.abs(to.row - from.row) === Math.abs(to.col - from.col);
    }
    
    case 'king': {
      return Math.abs(to.row - from.row) <= 1 && Math.abs(to.col - from.col) <= 1;
    }
    
    default:
      return false;
  }
};