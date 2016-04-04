import { rand, constrain } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';
import { particles } from './particles';

const initialState = {
  sn: 0,
  frameRequestId: 0
};

export function layer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MOVE_PARTICLE:
      return Object.assign({}, state, {
        sn: state.sn+1,
        particles: particles(state.particles, action)
      });
    case actionTypes.PARTICLE_MOVE_REQUESTED:
      return Object.assign({}, state, {
        frameRequestId: action.frameRequestId
      });
    case actionTypes.ADD_PARTICLE:
      return Object.assign({}, state, {
        particles: particles(state.particles, action)
      });
    case actionTypes.DELETE_PARTICLE:
      return Object.assign({}, state, {
        particles: particles(state.particles, action)
      });
    default:
      return Object.assign({}, state, {
        particles: particles(undefined, action)
      });
  }
}
