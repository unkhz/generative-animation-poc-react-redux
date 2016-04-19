// @flow
import {initPartialState} from 'utils/reducerHelpers';
import {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import {environment} from './environment';
import {layers} from './layers';
import {particles} from './particles';
import {styles} from './styles';

/**
 * Pipe partial reducers together, so that they can chain modifications
 * on shared global properties. NB! This is intentionally unorthodox compared to
 * the standard combineReducers way, which forces isolation of reducers.
 */
function pipeReduce(reducers: Function[], state: GlobalStateType, action: ActionType): GlobalStateType {
  return reducers.reduce((state: GlobalStateType, reducer: Function): GlobalStateType => {
    return reducer(state, action);
  }, state);
}

export default function(state: GlobalStateType, action: ActionType): GlobalStateType {
  return pipeReduce([
    environment,
    styles,
    layers,
    particles,
    countParticles
  ], state, action);
};

function countParticles(state: GlobalStateType): GlobalStateType {
  return {
    ...state,
    aliveParticleCount: state.particles.filter((p: ParticleType) => !p.isToBeDestroyed).length
  };
}
