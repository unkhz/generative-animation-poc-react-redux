// @flow
import { combineReducers } from 'redux';
import { layers } from './layers';
import { particles } from './particles';

export default (state: Object, action: Object): Object => {
  return {
    ...state,
    ...layers(state, action),
    ...particles(state, action),
  };
};
