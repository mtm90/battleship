import React from 'react';

const Ship = ({ ship, onPlaceShip }) => {
  return (
    <div>
      {ship.name}
      <button onClick={() => onPlaceShip(ship)}>Place</button>
    </div>
  );
};

export default Ship;
