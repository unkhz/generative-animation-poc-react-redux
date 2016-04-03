import * as types from '../constants/ActionTypes';

export function addParticle(character) {
  return {
    type: types.ADD_PARTICLE
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
