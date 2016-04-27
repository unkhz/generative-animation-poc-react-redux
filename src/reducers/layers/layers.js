// @flow
import {initPartialState} from 'utils/reducerHelpers';
import * as actionTypes from 'constants/ActionTypes';
import type {LayerType, ActionType, GlobalStateType} from 'constants/Types';

let layerId = 0;
function createLayer(styleName: string): LayerType {
  return {
    id: layerId++,
    sn: 0,
    frameRequestId: 0,
    styleName,
  };
}

export const reducer = layers;
export const exportedKey: string = 'layers';
export const importedKeys: string[] = [];

const initialState = [];

export function layers(state: LayerType[] = initialState, action: ActionType): LayerType[] {
  switch (action.type) {
    case actionTypes.ADD_STYLE:
      return [
        ...state,
        createLayer(action.style.name),
      ];

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
