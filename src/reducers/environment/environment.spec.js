import * as actionTypes from 'constants/ActionTypes';
import {environment} from 'reducers/environment';
import {assert} from 'chai';

describe('environment reducer', () => {

  it('produces initial state', () => {
    const state = environment({}, {type: null});
    assert.isObject(state);
  });

  it('produces radius on envResized on portrait', () => {
    const state = environment({}, {
      type: actionTypes.ENV_RESIZED,
      width: 768,
      height: 1024
    });
    assert.equal(state.env.radius, 768/2);
  });

  it('produces radius on envResized on landscape', () => {
    const state = environment({}, {
      type: actionTypes.ENV_RESIZED,
      width: 14425,
      height: 142
    });
    assert.equal(state.env.radius, 142/2);
  });

});
