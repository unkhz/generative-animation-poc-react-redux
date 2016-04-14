import * as actions from 'actions/Actions';
import * as actionTypes from 'constants/ActionTypes';
import { requestAnimationFrame, cancelAnimationFrame } from 'utils/animationFrameHelpers';
import {assert} from 'chai';
import {spy} from 'sinon';

describe('Actions', () => {

  it('envResized returns an action', () => {
    const action = actions.envResized(0,0);
    assert.equal(action.type, actionTypes.ENV_RESIZED);
    assert.equal(action.width, 0);
    assert.equal(action.height, 0);
  });

  it('toggleAnimation returns an action', () => {
    const action = actions.toggleAnimation();
    assert.equal(action.type, actionTypes.TOGGLE_ANIMATION);
  });

  it('addParticle returns an action', () => {
    const action = actions.addParticle(12);
    assert.equal(action.type, actionTypes.ADD_PARTICLE);
    assert.equal(action.count, 12);
  });

  describe('requestParticleMove', () => {
    it('returns a thunk', () => {
      const action = actions.requestParticleMove(123);
      assert.isFunction(action);
      const dispatch = spy();
      action(dispatch);
      const args = dispatch.firstCall.args[0];
      assert.equal(args.type, actionTypes.PARTICLE_MOVE_REQUESTED);
      assert.isTrue(dispatch.calledOnce);
    });

    it('creates new animation frame request', () => {
      const action = actions.requestParticleMove(123);
      const dispatch = spy();
      action(dispatch);
      const args = dispatch.firstCall.args[0];
      assert.notEqual(args.frameRequestId, 0);
      assert.notEqual(args.frameRequestId, 123);
    });

    it('eventually calls dispatch with moveParticle', (done: Function) => {
      const action = actions.requestParticleMove(123);
      const dispatch = (action: Function|Object) => {
        if (action && action.type === actionTypes.MOVE_PARTICLE) {
          done();
        }
      };
      action(dispatch);
    });
  });

  it('moveParticle returns an action', () => {
    const action = actions.moveParticle();
    assert.equal(action.type, actionTypes.MOVE_PARTICLE);
  });

  it('particleMoveRequested returns an action', () => {
    const action = actions.particleMoveRequested(123);
    assert.equal(action.type, actionTypes.PARTICLE_MOVE_REQUESTED);
    assert.equal(action.frameRequestId, 123);
  });

  it('deleteParticle returns an action', () => {
    const action = actions.deleteParticle(1234);
    assert.equal(action.type, actionTypes.DELETE_PARTICLE);
    assert.equal(action.id, 1234);
  });

  it('deleteSomeParticles returns an action', () => {
    const action = actions.deleteSomeParticles(12312);
    assert.equal(action.type, actionTypes.DELETE_SOME_PARTICLES);
    assert.equal(action.count, 12312);
  });


});
