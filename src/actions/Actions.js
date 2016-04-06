import * as types from '../constants/ActionTypes';
import * as rules from '../constants/Rules';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/animationFrameHelpers';

export function appMounted() {
  return requestParticleMove();
}

export function appScrollWheeled(deltaX, deltaY) {
  return function(dispatch){
    const normalizedValue = Math.min(10, Math.round(deltaY/50));
    if (deltaY > 0) {
      dispatch(addParticle(normalizedValue));
    } else {
      dispatch(deleteSomeParticles(-normalizedValue));
    }
  };
}

export function addParticle(count) {
  return {
    type: types.ADD_PARTICLE,
    moveRules: rules.particleMoveRules,
    count
  };
}

export function requestParticleMove(frameRequestId) {
  return function(dispatch){
    if (frameRequestId) {
      cancelAnimationFrame(frameRequestId);
    }

    let newFrameRequestId = requestAnimationFrame(() => {
      dispatch(moveParticle());
      dispatch(requestParticleMove(frameRequestId));
    });

    dispatch(particleMoveRequested(newFrameRequestId));
  };
}

export function particleMoveRequested(frameRequestId) {
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

export function deleteSomeParticles(count) {
  return {
    type: types.DELETE_SOME_PARTICLES,
    count
  };
}
