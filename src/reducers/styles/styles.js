// @flow
import {initPartialState} from 'utils/reducerHelpers';
import * as actionTypes from 'constants/ActionTypes';
import {ActionType, GlobalStateType, StyleType} from 'constants/Types';

let styleId = 0;
export function createStyle(style: StyleType): StyleType {
  return {
    id: styleId++,
    ...style
  };
}

export const reducer = styles;
export const exportedKey: string = 'styles';
export const importedKeys: string[] = [];

const initialState = [];

export function styles(state: StyleType[] = initialState, action: ActionType): StyleType[] {
  switch (action.type) {

    case actionTypes.ADD_STYLE:
      return [
        ...state,
        createStyle(action.style)
      ];

    default:
      return state;
  }
}
