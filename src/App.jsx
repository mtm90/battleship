import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Ship from './Ship';
import './App.css';

const initialGrid = () =>
  Array(10).fill(null).map(() => Array(10).fill(null));

const ships = [
  { name: 'Destroyer', size: 1 },
  { name: 'Submarine', size: 2 },
  { name: 'Cruiser', size: 3 },
  { name: 'Battleship', size: 4 },
  { name: 'Aircraft Carrier', size: 5 },
];

const App = () => {
  const [playerGrid, setPlayerGrid] = useState(initialGrid());
  const [computerGrid, setComputerGrid] = useState(initialGrid());
  const [currentShip, setCurrentShip] = useState(null);
  const [placingShip, setPlacingShip] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [placedShips, setPlacedShips] = useState([]);

  useEffect(() => {
    if (placedShips.length === ships.length) {
      placeComputerShips();
    }
  }, [placedShips]);

  const placeComputerShips = () => {
    let newGrid = computerGrid.map(row => [...row]);

    ships.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (canPlaceShip(newGrid, ship.size, row, col, orientation)) {
          newGrid = placeShipOnGrid(newGrid, ship.size, row, col, orientation);
          placed = true;
        }
      }
    });
    setComputerGrid(newGrid);
  };

  const canPlaceShip = (grid, size, row, col, orientation) => {
    if (orientation === 'horizontal') {
      if (col + size > 10) return false;
      for (let i = col; i < col + size; i++) {
        if (grid[row][i] !== null) return false;
      }
    } else {
      if (row + size > 10) return false;
      for (let i = row; i < row + size; i++) {
        if (grid[i][col] !== null) return false;
      }
    }
    return true;
  };

  const placeShipOnGrid = (grid, size, row, col, orientation) => {
    const newGrid = grid.map(row => [...row]);
    if (orientation === 'horizontal') {
      for (let i = col; i < col + size; i++) {
        newGrid[row][i] = 'ship';
      }
    } else {
      for (let i = row; i < row + size; i++) {
        newGrid[i][col] = 'ship';
      }
    }
    return newGrid;
  };

  const handleCellClick = (row, col) => {
    if (placingShip && currentShip) {
      if (canPlaceShip(playerGrid, currentShip.size, row, col, orientation)) {
        const newGrid = placeShipOnGrid(playerGrid, currentShip.size, row, col, orientation);
        setPlayerGrid(newGrid);
        setCurrentShip(null);
        setPlacingShip(false);
        setPlacedShips([...placedShips, currentShip.name]);
      }
    } else if (playerTurn && !gameOver && computerGrid[row][col] !== 'hit' && computerGrid[row][col] !== 'miss') {
      if (placedShips.length !== ships.length) {
        alert('You have to place all ships to start game.');
      } else {
        const newGrid = computerGrid.map(row => [...row]);
        if (newGrid[row][col] === 'ship') {
          newGrid[row][col] = 'hit';
        } else {
          newGrid[row][col] = 'miss';
        }
        setComputerGrid(newGrid);
        setPlayerTurn(false);
        checkWinCondition(newGrid, 'computer');
        setTimeout(computerMove, 1000);
      }
    }
  };

  const computerMove = () => {
    let newGrid = playerGrid.map(row => [...row]);
    let moveMade = false;
    while (!moveMade) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (newGrid[row][col] !== 'hit' && newGrid[row][col] !== 'miss') {
        if (newGrid[row][col] === 'ship') {
          newGrid[row][col] = 'hit';
        } else {
          newGrid[row][col] = 'miss';
        }
        moveMade = true;
      }
    }
    setPlayerGrid(newGrid);
    checkWinCondition(newGrid, 'player');
    setPlayerTurn(true);
  };

  const checkWinCondition = (grid, player) => {
    let allShipsSunk = true;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell === 'ship') allShipsSunk = false;
      });
    });
    if (allShipsSunk) {
      setGameOver(true);
      alert(`${player === 'player' ? 'Computer' : 'Player'} wins!`);
    }
  };

  const placeShip = (ship) => {
    if (!placedShips.includes(ship.name)) {
      setCurrentShip(ship);
      setPlacingShip(true);
    } else {
      alert(`You have already placed a ${ship.name}.`);
    }
  };

  const toggleOrientation = () => {
    setOrientation((prevOrientation) => (prevOrientation === 'horizontal' ? 'vertical' : 'horizontal'));
  };

  return (
    <div className='battleships'>
      <div className='ships'>
        <h1>Battleships:</h1>
        {ships.map((ship) => (
          <Ship key={ship.name} ship={ship} onPlaceShip={placeShip} />
        ))}
        <button onClick={toggleOrientation}>
          Toggle Orientation (Current: {orientation})
        </button>
      </div>
      <div>
        <h2>Player Grid</h2>
        <Grid grid={playerGrid} onCellClick={handleCellClick} />
      </div>
      <div>
        <h2>Computer Grid</h2>
        <Grid grid={computerGrid} onCellClick={handleCellClick} hideShips={true} />
      </div>
    </div>
  );
};

export default App;
