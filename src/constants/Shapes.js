import {PropTypes as types} from 'react';

export const actions = types.objectOf(types.func).isRequired;

export const particleCollection = types.shape({
  count: types.number.isRequired,
  particles,
}).isRequired;

export const particle = types.shape({
  id: types.number.isRequired,
  sn: types.number.isRequired,
  isToBeDestroyed: types.bool.isRequired,
  style: types.objectOf(types.number).isRequired,
  transform: types.objectOf(types.number).isRequired,
  speed: types.objectOf(types.number).isRequired,
  unit: types.objectOf(types.string).isRequired,
  moveRules: types.objectOf(types.oneOfType([types.func, types.object])).isRequired
}).isRequired;

export const particles = types.arrayOf(particle).isRequired;

export const layer = types.shape({
  id: types.number.isRequired,
  sn: types.number.isRequired,
  frameRequestId: types.number.isRequired,
  color,
}).isRequired;

export const layers = types.arrayOf(layer).isRequired;

export const color = types.shape({
  r: types.number.isRequired,
  g: types.number.isRequired,
  b: types.number.isRequired
}).isRequired;
