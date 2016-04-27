// @flow
import {initPartialState} from 'utils/reducerHelpers';
import {ActionType, EnvironmentType} from 'constants/Types';
import * as actionTypes from 'constants/ActionTypes';

const initialState = {
  radius: 100,
  width: 0,
  height: 0,
  isMovementPaused: false,
};

export const reducer = environment;
export const exportedKey: string = 'env';
export const importedKeys: string[] = [];

export function environment(state: EnvironmentType = initialState, action: ActionType): EnvironmentType {
  switch (action.type) {
    case actionTypes.ENV_RESIZED:
      return {
        radius: Math.min(action.width, action.height)/2,
        width: action.width,
        height: action.height,
      };

    case actionTypes.TOGGLE_ANIMATION:
      return {
        ...state,
        isMovementPaused: !state.isMovementPaused
      };

    default:
      return state;
  }
}
