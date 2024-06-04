import React from 'react';

const Grid = ({ grid, onCellClick, hideShips }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${cell === 'hit' ? 'hit' : ''} ${cell === 'miss' ? 'miss' : ''}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {!hideShips && cell === 'ship' ? 'ship' : cell === 'hit' ? 'X' : cell === 'miss' ? 'O' : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
