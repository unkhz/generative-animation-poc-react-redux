// @flow
import { combineReducers } from 'redux';
import { layers } from './layers';
import { particles } from './particles';

export default combineReducers({
  layers,
  particles
});
