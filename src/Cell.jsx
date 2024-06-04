import React from 'react';

const Cell = ({ status, onClick }) => {
  let className = 'cell';
  if (status === 'ship') className += ' ship';
  if (status === 'hit') className += ' hit';
  if (status === 'miss') className += ' miss';

  return <div className={className} onClick={onClick}></div>;
};

export default Cell;
