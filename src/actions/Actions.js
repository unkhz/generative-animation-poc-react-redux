import * as types from '../constants/ActionTypes';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/animationFrameHelpers';

export function addParticle(character) {
  return {
    type: types.ADD_PARTICLE
  };
}

export function requestParticleMove(particleId, frameRequestId) {
  return function(dispatch){
    if (frameRequestId) {
      cancelAnimationFrame(frameRequestId);
    }

    let newFrameRequestId = requestAnimationFrame(() => {
      dispatch(moveParticle(particleId));
      dispatch(requestParticleMove(particleId));
    });

    dispatch(particleMoveRequested(particleId, newFrameRequestId));
  };
}

export function particleMoveRequested(particleId, frameRequestId) {
  return {
    type: types.PARTICLE_MOVE_REQUESTED,
    particleId,
    frameRequestId
  };
}

export function moveParticle(id) {
  return {
    type: types.MOVE_PARTICLE,
    id
  };
}


export function deleteParticle(id) {
  return {
    type: types.DELETE_PARTICLE,
    id
  };
}
