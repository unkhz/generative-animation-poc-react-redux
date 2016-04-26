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

const initialState = {
  styles: []
};

export function styles(state: GlobalStateType, action: ActionType): GlobalStateType {
  state = initPartialState(state, initialState, 'styles');

  switch (action.type) {

    case actionTypes.ADD_STYLE:
      return {
        ...state,
        styles: [
          ...state.styles,
          createStyle(action.style)
        ]
      };

    default:
      return state;
  }
}

export const reducer = styles;
export const exportedKeys: string[] = ['styles'];
export const importedKeys: string[] = [];
