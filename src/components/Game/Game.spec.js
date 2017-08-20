import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import Game from './Game';

describe('Game component', () => {
  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('returns the good results for the "merge" method', () => {
    const wrapper = shallow(<Game />);
    const instance = wrapper.instance();

    expect(instance.merge([{value: 2}, {value: 2}, {value: 2}, {value: 2}]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);

    expect(instance.merge([{value: 2}, {value: 2}, {value: 2}, {value: 2}], true))
      .toEqual([
        null,
        null,
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4})
      ]);

    expect(instance.merge([{value: 2}, {value: 2}, {value: 2}, null]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 2}),
        null,
        null
      ]);

    expect(instance.merge([null, {value: 2}, {value: 2}, {value: 2}]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 2}),
        null,
        null
      ]);

    expect(instance.merge([{value: 2}, {value: 4}, {value: 2}, null]))
      .toEqual([
        expect.objectContaining({value: 2}),
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 2}),
        null
      ]);

    expect(instance.merge([null, {value: 2}, {value: 4}, {value: 2}]))
      .toEqual([
        expect.objectContaining({value: 2}),
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 2}),
        null
      ]);

    expect(instance.merge([{value: 4}, {value: 2}, {value: 2}, null]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);

    expect(instance.merge([null, {value: 4}, {value: 2}, {value: 2}]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);

    expect(instance.merge([{value: 2}, {value: 2}, {value: 4}, null]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);

    expect(instance.merge([null, {value: 2}, {value: 2}, {value: 4}]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);

    expect(instance.merge([{value: 2}, {value: 2}, {value: 4}, {value: 4}]))
      .toEqual([
        expect.objectContaining({value: 4}),
        expect.objectContaining({value: 8}),
        null,
        null
      ]);

    expect(instance.merge([{value: 4}, {value: 4}, {value: 2}, {value: 2}]))
      .toEqual([
        expect.objectContaining({value: 8}),
        expect.objectContaining({value: 4}),
        null,
        null
      ]);
  });

  it('should be game over', () => {
    const wrapper = shallow(<Game />);
    const instance = wrapper.instance();
    expect(instance.isGameOver([
      [{value: 2}, {value: 4}, {value: 2}, {value: 4}],
      [{value: 4}, {value: 2}, {value: 4}, {value: 2}],
      [{value: 2}, {value: 4}, {value: 2}, {value: 4}],
      [{value: 4}, {value: 2}, {value: 8}, {value: 2}]
    ])).toEqual(true);
  });

  it('should not be game over', () => {
    const wrapper = shallow(<Game />);
    const instance = wrapper.instance();
    expect(instance.isGameOver([
      [{value: 2}, {value: 4}, {value: 2}, {value: 4}],
      [{value: 4}, {value: 2}, {value: 4}, {value: 2}],
      [{value: 2}, {value: 4}, {value: 2}, {value: 4}],
      [{value: 4}, {value: 2}, {value: 8}, {value: 4}]
    ])).toEqual(false);
  });
});
