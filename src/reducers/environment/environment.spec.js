import * as actionTypes from 'constants/ActionTypes';
import {environment} from 'reducers/environment';
import {assert} from 'chai';

describe('particles reducer', () => {
  it('returns initial state', () => {
    const state = environment({}, {type: null});
    assert.isObject(state);
    assert.isObject(state.env);
  });

  it('updates radius on envResized based on smallest dimension', () => {
    let state;

    state = environment({}, {
      type: actionTypes.ENV_RESIZED,
      width: 125,
      height: 142
    });
    assert.equal(state.env.radius, 125/2);

    state = environment({}, {
      type: actionTypes.ENV_RESIZED,
      width: 14425,
      height: 142
    });
    assert.equal(state.env.radius, 142/2);
  });
});
