import React from 'react';
import { css } from 'aphrodite';
import Swipeable from 'react-swipeable'

import {
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  KEY_CODES,
  STATUS_LOST,
  STATUS_RUNNING
} from '../../settings/const';

import Board from '../Board/Board.jsx';
import { styles } from './Game.css';

class Game extends React.PureComponent {
  handleKey = (event) => {
    const keyCode = String(event.keyCode);
    if(Object.keys(KEY_CODES).indexOf(keyCode) !== -1) {
      this.handleDirection(KEY_CODES[keyCode]);
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

  canTileBeMerged(board, rowIndex, colIndex) {
    const value = board[rowIndex][colIndex].value;
    return Boolean((board[rowIndex - 1] && board[rowIndex - 1][colIndex].value === value)
      || (board[rowIndex + 1] && board[rowIndex + 1][colIndex].value === value)
      || (board[rowIndex][colIndex - 1] && board[rowIndex][colIndex - 1].value === value)
      || (board[rowIndex][colIndex + 1] && board[rowIndex][colIndex + 1].value === value));
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
      score: 0,
      nextId: 16,
      status: STATUS_RUNNING
    };
  }

  handleDirection(direction) {
    const board = this.move(this.cloneBoard(this.state.board), direction);
    if (this.hasBoardDifferences(this.state.board, board)) {
      this
        .reduceBoard(board, (acc, tile, colIndex, row, rowIndex) =>
          tile ? acc.concat(tile) : acc)
        .forEach(tile => tile.isNew = false);
      this.addRandomCell(board, this.state.nextId);
      this.setState(prevState => ({board, nextId: prevState.nextId + 1}));
    } else {
      const availableCells = this.reduceBoard(board, (acc, tile, colIndex, row, rowIndex) =>
        tile ? acc : acc.concat({row: rowIndex, col: colIndex}));
      if (availableCells.length === 0 && this.isGameOver(board)) {
        this.setState(prevState => ({status: STATUS_LOST}));
      }
    }
  }

  handleSwipe(direction, event, delta, isFlick) {
    if (isFlick) {
      this.handleDirection(direction);
    }
  }

  hasBoardDifferences(a, b) {
    return this
      .reduceBoard(a, (acc, tile, colIndex, row, rowIndex) =>
        acc.concat(this.hasCellDifferences(tile, b[rowIndex][colIndex]))
      )
      .reduce((a, b) => a + b);
  }

  hasCellDifferences(a, b) {
    return Boolean((a && !b)
      || (!a && b)
      || (a && b && a.value !== b.value));
  }

  isGameOver(board) {
    return !this
      .reduceBoard(board, (acc, tile, colIndex, row, rowIndex) =>
        acc.concat(this.canTileBeMerged(board, rowIndex, colIndex))
      )
      .reduce((a, b) => a + b);
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
            this.setState(prevState => ({score: prevState.score + tile.value * 2}));
          } else {
            newLine[newIndex] = tile;
          }
        }
      });
    return reverse ? newLine.reverse() : newLine;
  }

  move(board, direction) {
    if (direction === DIRECTION_DOWN || direction === DIRECTION_UP) {
      board = this.transpose(board);
    }
    board = board.map(line =>
      this.merge(line, direction === DIRECTION_RIGHT || direction === DIRECTION_DOWN)
    );
    if (direction === DIRECTION_DOWN || direction === DIRECTION_UP) {
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
        <Swipeable
          trackMouse
          style={{ touchAction: 'none' }}
          preventDefaultTouchmoveEvent
          onSwipedDown={this.handleSwipe.bind(this, DIRECTION_DOWN)}
          onSwipedLeft={this.handleSwipe.bind(this, DIRECTION_LEFT)}
          onSwipedRight={this.handleSwipe.bind(this, DIRECTION_RIGHT)}
          onSwipedUp={this.handleSwipe.bind(this, DIRECTION_UP)}
        >
          <Board board={this.state.board} />
        </Swipeable>
        <div className={css(styles.message)} >
          <p>Score : {this.state.score}</p>
          {this.state.status === STATUS_LOST && (
            <p>Game over</p>
          )}
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
