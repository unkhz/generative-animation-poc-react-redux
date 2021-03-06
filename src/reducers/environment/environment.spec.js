import * as actions from 'actions/Actions';
import {environment} from 'reducers/environment';
import {assert} from 'chai';

describe('environment reducer', () => {

  it('produces initial state', () => {
    const state = environment({}, {type: null});
    assert.isObject(state);
  });

  it('produces radius on envResized on portrait', () => {
    const state = environment({}, actions.envResized(768, 1024));
    assert.equal(state.radius, 768/2);
    assert.equal(state.width, 768);
    assert.equal(state.height, 1024);
  });

  it('produces radius on envResized on landscape', () => {
    const state = environment({}, actions.envResized(14425, 142));
    assert.equal(state.radius, 142/2);
    assert.equal(state.width, 14425);
    assert.equal(state.height, 142);
  });

});
