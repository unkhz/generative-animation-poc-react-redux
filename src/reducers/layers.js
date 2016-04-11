// @flow
import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';
import { particles } from './particles';
import type {LayerType, ActionType} from 'constants/Types';

let layerId = 0;
function createLayer(): LayerType {
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

// $FlowFixMe: Can't cope with Array.apply
const initialState = Array.apply(null, {length: 8}).map(() => createLayer());

export function layers(state: LayerType[] = initialState, action: ActionType): LayerType[] {
  switch (action.type) {
    case actionTypes.MOVE_PARTICLE:
      return state.map((layer: LayerType): LayerType => {
        return {
          ...layer,
          sn: layer.sn+1
        };
      });
    case actionTypes.PARTICLE_MOVE_REQUESTED:
      return state.map((layer: LayerType): LayerType => {
        return {
          ...layer,
          frameRequestId: action.frameRequestId,
        };
      });
    default:
      return state;
  }
}
