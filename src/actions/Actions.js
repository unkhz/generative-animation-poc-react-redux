import type {ActionType, ThunkType} from 'constants/Types';
import * as actionTypes from 'constants/ActionTypes';
import * as rules from 'constants/Rules';
import { requestAnimationFrame, cancelAnimationFrame } from 'utils/animationFrameHelpers';

export function appMounted(): ActionType|ThunkType {
  return requestParticleMove();
}

export function envResized(width: number, height: number): ActionType|ThunkType {
  return {
    type: actionTypes.ENV_RESIZED,
    width,
    height
  };
}

export function toggleAnimation(): ActionType|ThunkType {
  return {
    type: actionTypes.TOGGLE_ANIMATION
  };
}

export function addParticle(count: number): ActionType|ThunkType {
  return {
    type: actionTypes.ADD_PARTICLE,
    moveRules: rules.particleMoveRules,
    count
  };
}

export function requestParticleMove(frameRequestId: Number): ActionType|ThunkType {
  return function(dispatch: func){
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

export function particleMoveRequested(frameRequestId?: number): ActionType|ThunkType {
  return {
    type: actionTypes.PARTICLE_MOVE_REQUESTED,
    frameRequestId
  };
}

export function moveParticle(): ActionType|ThunkType {
  return {
    type: actionTypes.MOVE_PARTICLE,
  };
}


export function deleteParticle(id: number): ActionType|ThunkType {
  return {
    type: actionTypes.DELETE_PARTICLE,
    id
  };
}

export function deleteSomeParticles(count: number): ActionType|ThunkType {
  return {
    type: actionTypes.DELETE_SOME_PARTICLES,
    count
  };
}
