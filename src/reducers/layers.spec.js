import * as actions from 'actions/Actions';
import * as actionTypes from 'constants/ActionTypes';
import {layers} from 'reducers/layers';
import {assert} from 'chai';

describe('layers reducer', () => {
  it('returns initial state', () => {
    const state = layers(undefined, {type: null});
    assert.isArray(state);
    assert.equal(state[0].id, 0);
    assert.equal(state[0].sn, 0);
    assert.isNumber(state[0].color.r);
    assert.isNumber(state[0].color.g);
    assert.isNumber(state[0].color.b);
  });

  it('updates serial number on moveParticle', () => {
    const state = layers([{sn: 0}], {
      type: actionTypes.MOVE_PARTICLE
    });
    assert.equal(state[0].sn, 1);
  });

  it('updates frameRequestId on particleMoveRequested', () => {
    const state = layers([{frameRequestId: 0}], {
      type: actionTypes.PARTICLE_MOVE_REQUESTED,
      frameRequestId: 1234,
    });
    assert.equal(state[0].frameRequestId, 1234);
  });
});
