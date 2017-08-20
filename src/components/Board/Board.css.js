import { StyleSheet } from 'aphrodite';

import { TILE_GUTTER, TILE_WIDTH } from '../../settings/const';

export const styles = StyleSheet.create({
  board: {
    background: '#bbada0',
    margin: '0 auto',
    width: `${4 * (TILE_WIDTH + TILE_GUTTER)}px`,
    height: `${4 * (TILE_WIDTH + TILE_GUTTER)}px`,
    padding: `${TILE_GUTTER}px 0 0 ${TILE_GUTTER}px`,
    borderRadius: '6px'
  },
  cell: {
    float: 'left',
    background: 'rgba(238, 228, 218, 0.35)',
    width: `${TILE_WIDTH}px`,
    height: `${TILE_WIDTH}px`,
    margin: `0 ${TILE_GUTTER}px ${TILE_GUTTER}px 0`,
    borderRadius: '3px'
  },
  container: {
    position: 'relative'
  }
});
