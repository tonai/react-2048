import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';

import {
  TILE_BACKGROUND_COLORS,
  TILE_COLORS,
  TILE_FONT_SIZES,
  TILE_GUTTER,
  TILE_WIDTH
} from '../../settings/const';

import { styles } from './Tile.css';

class Tile extends React.PureComponent {
  componentWillUpdate(nextProps, nextState) {
    if (nextState.merge && this.state.merge) {
      this.setState({merge: false});
    }
  }

  constructor(props) {
    super(props);
    this.state = {merge: false};
  }

  getPow(value) {
    let pow = 0;
    let rest = value;
    while (rest !== 1) {
      rest /= 2;
      pow++;
    }
    return pow;
  }

  render() {
    const pow = this.getPow(this.props.value);
    const style = {
      fontSize: TILE_FONT_SIZES[Math.min(pow, TILE_FONT_SIZES.length) - 1],
      backgroundColor: TILE_BACKGROUND_COLORS[Math.min(pow, TILE_BACKGROUND_COLORS.length) - 1],
      color: TILE_COLORS[Math.min(parseInt(pow / 3, 10), 1)],
      left: `${this.props.col * (TILE_WIDTH + TILE_GUTTER)}px`,
      top: `${this.props.row * (TILE_WIDTH + TILE_GUTTER)}px`
    };
    if (this.props.merged) {
      setTimeout(() => this.setState({merge: true}), 0);
    }
    return (
      <div
        className={css(
          styles.tile,
          this.props.isNew && styles.tileNew,
          this.state.merge && styles.tileMerged,
        )}
        style={style}
      >{this.props.value}</div>
    );
  }
}

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  isNew: PropTypes.bool,
  merged: PropTypes.bool,
  row: PropTypes.number.isRequired,
  value: PropTypes.number
};

Tile.defaultProps = {};

export default Tile;
