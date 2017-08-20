import React from 'react';
import { css } from 'aphrodite';

import {
  KEY_BOTTOM,
  KEY_CODES,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_TOP,
  STATUS_LOST,
  STATUS_RUNNING,
  STATUS_WIN,
} from '../../settings/const';

import Board from '../Board/Board.jsx';
import { styles } from './Game.css';

class Game extends React.PureComponent {
  handleKey = (event) => {
    const keyCode = String(event.keyCode);
    if(Object.keys(KEY_CODES).indexOf(keyCode) !== -1) {
      this.setState(prevState => {
        const board = this.move(this.cloneBoard(prevState.board), KEY_CODES[keyCode]);
        if (this.hasBoardDifferences(prevState.board, board)) {
          this
            .reduceBoard(board, (acc, tile, colIndex, row, rowIndex) =>
              tile ? acc.concat(tile) : acc)
            .forEach(tile => tile.isNew = false);
          this.addRandomCell(board, prevState.nextId);
          return {
            board,
            nextId: prevState.nextId + 1
          };
        }
      });
    }
  };

  restart = () => {
    this.setState(this.getInitialState());
  };

  addRandomCell(board, nextId) {
    const availableCells = this.reduceBoard(board, (acc, tile, colIndex, row, rowIndex) =>
      tile ? acc : acc.concat({row: rowIndex, col: colIndex}));
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.row][randomCell.col] = {
      id: nextId,
      isNew: true,
      value
    };
  }

  cloneBoard(board) {
    return board.map(row => [...row]);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey);
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  findIndex(newLine, value, index) {
    if (index < 0) {
      return index + 1;
    } else {
      const newTile = newLine[index];
      if (!newTile) {
        return this.findIndex(newLine, value, index - 1);
      } else if (!newTile.mergedTile && newTile.value === value) {
        return index;
      } else {
        return index + 1;
      }
    }
  }

  getInitialState() {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.addRandomCell(board, 0);
    this.addRandomCell(board, 1);
    return {
      board,
      nextId: 2,
      status: STATUS_RUNNING
    };
  }

  hasBoardDifferences(a, b) {
    return this
      .reduceBoard(a, (acc, tile, colIndex, row, rowIndex) =>
        acc.concat(this.hasCellDifferences(tile, b[rowIndex][colIndex]))
      )
      .reduce((a, b) => a + b);
  }

  hasCellDifferences(a, b) {
    return Boolean(a && !b
      || !a && b
      || a && b && a.value !== b.value);
  }

  merge(line, reverse = false) {
    const newLine = [null, null, null, null];
    line = reverse ? line.reverse() : line;
    line
      .map(tile => tile && {...tile, mergedTile: false})
      .forEach((tile, index) => {
        if (tile) {
          const newIndex = this.findIndex(newLine, tile.value, index - 1);
          if (newLine[newIndex]) {
            newLine[newIndex].value = newLine[newIndex].value + tile.value;
            newLine[newIndex].mergedTile = tile;
            line[index] = null;
          } else {
            newLine[newIndex] = tile;
          }
        }
      });
    return reverse ? newLine.reverse() : newLine;
  }

  move(board, direction) {
    if (direction === KEY_BOTTOM || direction === KEY_TOP) {
      board = this.transpose(board);
    }
    board = board.map(line => this.merge(line, direction === KEY_RIGHT || direction === KEY_BOTTOM));
    if (direction === KEY_BOTTOM || direction === KEY_TOP) {
      board = this.transpose(board);
    }
    return board;
  }

  reduceBoard(board, reducer) {
    return board.reduce((acc, row, rowIndex) =>
      acc.concat(row.reduce((...args) => reducer(...args, rowIndex), []))
    , []);
  }

  render() {
    return (
      <div>
        <Board
          board={this.state.board}
          status={this.state.status}
        />
      <div className={css(styles.message)} >
          <button onClick={this.restart} >Restart</button>
        </div>
      </div>
    );
  }

  transpose(board) {
    return Object.keys(board[0]).map(colIndex => board.map(row => row[colIndex]));
  }
}

Game.propTypes = {};

Game.defaultProps = {};

export default Game;
