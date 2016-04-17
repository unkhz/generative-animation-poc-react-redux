// @flow
import { combineReducers } from 'redux';
import flow from 'lodash/fp/flow';
import thru from 'lodash/fp/thru';
import {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import {environment} from './environment';
import {layers} from './layers';
import {particles} from './particles';

export default (state: GlobalStateType, action: ActionType): GlobalStateType => {
  return flow(
    pipe(environment, action),
    pipe(layers, action),
    pipe(particles, action),
    pipe(countParticles, action),
  )(state);
};

/**
 * Create a pipeable version of a reducer function with a bound action
 */
function pipe(reducer: Function, action: ActionType): Function {
  return ((reducer: Function, action: ActionType, state: GlobalStateType): GlobalStateType => {
    return {
      ...state,
      ...reducer(state, action)
    };
  }).bind(null, reducer, action);
}

function countParticles(state: GlobalStateType): GlobalStateType {
  return {
    aliveParticleCount: state.particles.filter((p: ParticleType) => !p.isToBeDestroyed).length
  };
}
