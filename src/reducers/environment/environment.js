// @flow
import {ActionType, GlobalStateType} from 'constants/Types';
import * as actionTypes from 'constants/ActionTypes';

const initialState = {
  env: {
    radius: 100
  },
};

export function environment(state: GlobalStateType, action: ActionType): GlobalStateType {
  const {env} = state.env === undefined ? initialState : state;
  return reduce({
    env
  }, action);
}

function reduce(state: GlobalStateType, action: ActionType): GlobalStateType {
  switch (action.type) {
    case actionTypes.ENV_RESIZED:
      return {
        ...state,
        env: {
          radius: Math.min(action.width, action.height)/2
        }
      };
    default:
      return state;
  }
}
