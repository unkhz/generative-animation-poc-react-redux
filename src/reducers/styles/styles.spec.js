import * as actions from 'actions/Actions';
import {styles} from 'reducers/styles';
import {assert} from 'chai';
import {stub} from 'sinon';
import {createStyle} from './mock';

const initAction = {
  type: '@@redux/INIT'
};

describe('styles reducer', () => {
  it('returns initial state', () => {
    const state = styles(undefined, initAction);
    assert.isArray(state);
    assert.deepEqual(state, []);
  });

  it('adds a style on addStyle', () => {
    const state = styles(undefined, actions.addStyle(createStyle('test-style')));
    assert.equal(state.length, 1);
    assert.equal(state[0].name, 'test-style');
    assert.isNumber(state[0].id);
  });
});
