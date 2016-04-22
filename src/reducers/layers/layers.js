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

const initialState = {
  layers: [],
};

export function layers(state: GlobalStateType, action: ActionType): GlobalStateType {
  state = initPartialState(state, initialState, 'layers');
  switch (action.type) {
    case actionTypes.ADD_STYLE:
      return {
        ...state,
        layers: [
          ...state.layers,
          createLayer(action.style.name),
        ],
      };

    case actionTypes.MOVE_PARTICLE:
      return {
        ...state,
        layers: state.layers.map((layer: LayerType): LayerType => {
          return {
            ...layer,
            sn: layer.sn+1
          };
        })
      };
    case actionTypes.PARTICLE_MOVE_REQUESTED:
      return {
        ...state,
        layers: state.layers.map((layer: LayerType): LayerType => {
          return {
            ...layer,
            frameRequestId: action.frameRequestId,
          };
        })
      };
    default:
      return state;
  }
}
