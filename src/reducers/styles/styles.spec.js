import * as actions from 'actions/Actions';
import {styles} from 'reducers/styles';
import {assert} from 'chai';
import {stub} from 'sinon';

export function createStyle(name: string): Object {
  return {
    name,
    getInitialState: () => ({
      someBoolean: false,
      style: {
        opacity: [0]
      },
      transform: {
        translateX: [0, 'px']
      }
    }),
    rules: [
      ['someBoolean', (s: string, v: boolean) => !v],
      ['style.opacity', (s: string, [v, unit]: StyleValueType) => [v+1, unit]],
      ['transform.translateX', (s: string, [v, unit]: StyleValueType) => [v-1, unit]],
    ]
  };
}

export function initiateStateWithStyles(): GlobalStateType {
  return [...arguments].reduce((state: StateStyle, styleOrStyleName: Object|string): GlobalStateType => {
    const style = typeof styleOrStyleName === 'string' ? createStyle(styleOrStyleName) : styleOrStyleName;
    return styles(state, actions.addStyle(style));
  }, {});
}

describe('styles reducer', () => {
  it('returns initial state', () => {
    const state = styles({}, {type: null});
    assert.isObject(state);
    assert.deepEqual(state.styles, []);
  });

  it('adds a style on addStyle', () => {
    const state = styles({}, actions.addStyle(createStyle('test-style')));
    assert.equal(state.styles.length, 1);
    assert.equal(state.styles[0].name, 'test-style');
    assert.isNumber(state.styles[0].id);
  });
});
