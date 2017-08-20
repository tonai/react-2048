import { StyleSheet } from 'aphrodite';

import { TILE_WIDTH } from '../../settings/const';

const appearKeyframes = {
  '0%': {
    opacity: 0,
    transform: 'scale(0)'
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)'
  }
};

const popKeyframes = {
  '0%': {
    transform: 'scale(0)'
  },
  '50%': {
    transform: 'scale(1.2)'
  },
  '100%': {
    transform: 'scale(1)'
  }
};

const popBisKeyframes = {
  '0%': {
    transform: 'scale(0)'
  },
  '50%': {
    transform: 'scale(1.201)'
  },
  '100%': {
    transform: 'scale(1)'
  }
};

export const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: `${TILE_WIDTH}px`,
    height: `${TILE_WIDTH}px`,
    lineHeight: `${TILE_WIDTH}px`,
    borderRadius: '3px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
    transition: 'all 200ms'
  },
  tileNew: {
    animationName: appearKeyframes,
    animationDuration: '200ms',
    animationDelay: '100ms',
    animationFillMode: 'backwards'
  },
  tileMerged: {
    animationName: popKeyframes,
    animationDuration: '200ms',
    zIndex: 1
  },
  tileMergedBis: {
    animationName: popBisKeyframes,
    animationDuration: '200ms',
    zIndex: 1
  }
});
