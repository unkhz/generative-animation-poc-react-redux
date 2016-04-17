// @flow
import flow from 'lodash/fp/flow';
import {pipe, initPartialState} from 'utils/reducerHelpers';
import {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import {environment} from './environment';
import {layers} from './layers';
import {particles} from './particles';

/**
 * Pipe partial reducers together, so that they can chain modifications
 * on shared global properties. NB! This is intentionally unorthodox compared to
 * the standard combineReducers way, which forces isolation of reducers.
 */
export default (state: GlobalStateType, action: ActionType): GlobalStateType => {
  return flow(
    pipe(environment, action),
    pipe(layers, action),
    pipe(particles, action),
    pipe(countParticles, action),
  )(state);
};

function countParticles(state: GlobalStateType): GlobalStateType {
  return {
    ...state,
    aliveParticleCount: state.particles.filter((p: ParticleType) => !p.isToBeDestroyed).length
  };
}
