import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';
import { particles } from './particles';

let layerId = 0;
function createLayer() {
  return {
    id: layerId++,
    sn: 0,
    frameRequestId: 0,
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    }
  };
}

const initialState = [
  createLayer(),
  createLayer(),
  createLayer(),
  createLayer(),
];

export function layers(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MOVE_PARTICLE:
      return state.map((layer) => {
        return {
          ...layer,
          sn: layer.sn+1
        };
      });
    case actionTypes.PARTICLE_MOVE_REQUESTED:
      return state.map((layer) => {
        return {
          ...layer,
          frameRequestId: action.frameRequestId,
        };
      });
    default:
      return state;
  }
}
