import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';

import Tile from '../Tile/Tile.jsx';
import { styles } from './Board.css';

function Board({board, status}) {
  const tiles = board.reduce((acc, row, rowIndex) => {
    row = row.map((tile, colIndex) => ({...tile, col: colIndex, row: rowIndex}));
    const visibleTiles = row
      .filter(tile => typeof tile.id !== 'undefined');
    const mergedTiles = row
      .filter(tile => tile.mergedTile)
      .map(tile => ({...tile, ...tile.mergedTile}));
    return acc.concat(visibleTiles, mergedTiles);
  }, []);
  tiles.sort((a, b) => a.id > b.id ? 1 : -1);

  return (
    <div className={css(styles.board)} >
      <div className={css(styles.container)} >
        {board.map((row, rowIndex) => row.map((tile, colIndex) => (
          <div className={css(styles.cell)} key={`${rowIndex}-${colIndex}`} ></div>
        )))}
        {tiles.map(tile => (
          <Tile
            col={tile.col}
            isNew={Boolean(tile.isNew)}
            key={tile.id}
            id={tile.id}
            merged={Boolean(tile.mergedTile)}
            row={tile.row}
            value={tile.value}
          />
        ))}
      </div>
    </div>
  );
}

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array)
};

Board.defaultProps = {};

export default Board;
