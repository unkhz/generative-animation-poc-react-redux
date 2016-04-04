import * as types from '../constants/ActionTypes';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/animationFrameHelpers';

export function addParticle() {
  return {
    type: types.ADD_PARTICLE
  };
}

export function requestParticleMove(frameRequestId) {
  return function(dispatch){
    if (frameRequestId) {
      cancelAnimationFrame(frameRequestId);
    }

    let newFrameRequestId = requestAnimationFrame(() => {
      dispatch(moveParticle());
    });

    dispatch(particleMoveRequested(newFrameRequestId));
  };
}

export function particleMoveRequested(particleId, frameRequestId) {
  return {
    type: types.PARTICLE_MOVE_REQUESTED,
    frameRequestId
  };
}

export function moveParticle() {
  return {
    type: types.MOVE_PARTICLE,
  };
}


export function deleteParticle(id) {
  return {
    type: types.DELETE_PARTICLE,
    id
  };
}
