import React, { useState } from 'react';
import { Board, ChessPiece, Position } from '@/types/chess';
import { createInitialBoard, isValidMove } from '@/utils/chessUtils';
import { cn } from '@/lib/utils';
import { Crown, Diamond, Square, Triangle, Circle, ChevronUp } from 'lucide-react';

const ChessBoard = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const getPieceIcon = (piece: ChessPiece) => {
    const props = {
      className: cn(
        'w-8 h-8',
        piece.color === 'white' ? 'text-white' : 'text-black',
        'animate-piece-appear'
      ),
    };

    switch (piece.type) {
      case 'king':
        return <Crown {...props} />;
      case 'queen':
        return <Diamond {...props} />;
      case 'rook':
        return <Square {...props} />;
      case 'bishop':
        return <Triangle {...props} />;
      case 'knight':
        return <Circle {...props} />;
      case 'pawn':
        return <ChevronUp {...props} />;
      default:
        return null;
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPosition) {
      const piece = board[row][col];
      if (piece && piece.color === currentTurn) {
        setSelectedPosition({ row, col });
      }
    } else {
      const fromPiece = board[selectedPosition.row][selectedPosition.col];
      if (fromPiece) {
        if (isValidMove(selectedPosition, { row, col }, fromPiece, board, currentTurn)) {
          const newBoard = board.map(row => [...row]);
          const capturedPiece = newBoard[row][col];
          
          newBoard[row][col] = fromPiece;
          newBoard[selectedPosition.row][selectedPosition.col] = null;
          
          setBoard(newBoard);
          setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
          
          const moveNotation = `${fromPiece.type} ${String.fromCharCode(97 + selectedPosition.col)}${8 - selectedPosition.row} → ${String.fromCharCode(97 + col)}${8 - row}${capturedPiece ? ' captures ' + capturedPiece.type : ''}`;
          setMoveHistory([...moveHistory, moveNotation]);
        }
      }
      setSelectedPosition(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 items-center md:items-start">
      <div className="w-full md:w-auto">
        <div className="grid grid-cols-8 border-2 border-gray-800 w-full max-w-[600px] aspect-square">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square flex items-center justify-center cursor-pointer relative',
                  (rowIndex + colIndex) % 2 === 0 ? 'bg-chess-light' : 'bg-chess-dark',
                  selectedPosition?.row === rowIndex && selectedPosition?.col === colIndex && 'bg-chess-selected',
                )}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && getPieceIcon(piece)}
                <div className="absolute bottom-1 right-1 text-xs opacity-50">
                  {String.fromCharCode(97 + colIndex)}{8 - rowIndex}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="w-full md:w-64 space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold mb-2">Current Turn</h2>
          <div className={cn(
            'px-3 py-2 rounded',
            currentTurn === 'white' ? 'bg-gray-100' : 'bg-gray-800 text-white'
          )}>
            {currentTurn === 'white' ? 'White to move' : 'Black to move'}
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold mb-2">Move History</h2>
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {moveHistory.map((move, index) => (
              <div key={index} className="text-sm py-1 border-b">
                {index + 1}. {move}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
