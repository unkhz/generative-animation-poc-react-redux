import * as actions from 'actions/Actions';
import * as actionTypes from 'constants/ActionTypes';
import {layers} from 'reducers/layers';
import {assert} from 'chai';

const initAction = {
  type: '@@redux/INIT'
};

describe('layers reducer', () => {
  it('returns initial state', () => {
    const state = layers(undefined, initAction);
    assert.isArray(state.layers);
  });

  it('adds layers on addStyle', () => {
    let state = layers(undefined, initAction);
    assert.equal(state.layers.length, 0);
    state = layers(state, actions.addStyle({name: 'teststyyl'}));
    assert.equal(state.layers.length, 1);
    assert.equal(state.layers[0].styleName, 'teststyyl');
  });

  it('updates serial number on moveParticle', () => {
    let state = layers(undefined, actions.addStyle({name: 'test-style'}));
    state = layers(state, actions.moveParticle());
    assert.equal(state.layers[0].sn, 1);
  });

  it('updates frameRequestId on particleMoveRequested', () => {
    let state = layers(undefined, actions.addStyle({name: 'test-style'}));
    state = layers(state, actions.particleMoveRequested(1234));
    assert.equal(state.layers[0].frameRequestId, 1234);
  });
});
