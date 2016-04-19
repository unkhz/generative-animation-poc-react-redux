// @flow
import type {ActionType, ThunkType, StyleType} from 'constants/Types';
import * as actionTypes from 'constants/ActionTypes';
import * as rules from 'constants/Rules';
import { requestAnimationFrame, cancelAnimationFrame } from 'utils/animationFrameHelpers';

export function envResized(width: number, height: number): ActionType {
  return {
    type: actionTypes.ENV_RESIZED,
    width,
    height
  };
}

export function toggleAnimation(): ActionType {
  return {
    type: actionTypes.TOGGLE_ANIMATION
  };
}

export function addStyle(style: StyleType): ActionType {
  return {
    type: actionTypes.ADD_STYLE,
    style
  };
}

export function addParticle(count: number, styleName: string): ActionType {
  return {
    type: actionTypes.ADD_PARTICLE,
    styleName,
    count
  };
}

export function requestParticleMove(frameRequestId?: number): ThunkType {
  return function(dispatch: Function){
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

export function particleMoveRequested(frameRequestId?: number): ActionType {
  return {
    type: actionTypes.PARTICLE_MOVE_REQUESTED,
    frameRequestId
  };
}

export function moveParticle(): ActionType {
  return {
    type: actionTypes.MOVE_PARTICLE,
  };
}


export function deleteParticle(id: number): ActionType {
  return {
    type: actionTypes.DELETE_PARTICLE,
    id
  };
}

export function deleteSomeParticles(count: number): ActionType {
  return {
    type: actionTypes.DELETE_SOME_PARTICLES,
    count
  };
}
