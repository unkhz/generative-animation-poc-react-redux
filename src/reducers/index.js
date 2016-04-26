// @flow
import {initPartialState} from 'utils/reducerHelpers';
import {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import * as environment from './environment';
import * as layers from './layers';
import * as particles from './particles';
import * as styles from './styles';
import {createReducerGraph, registerReducer, getReducers} from 'utils/reducerGraph';

/**
 * Each reducer module exports the reducer function and its exports and imports.
 * In startup we create a topologically sorted graph of reducers based on this
 * information.
 */
let reducerGraph = createReducerGraph();
reducerGraph = registerReducer(reducerGraph, environment);
reducerGraph = registerReducer(reducerGraph, layers);
reducerGraph = registerReducer(reducerGraph, particles);
reducerGraph = registerReducer(reducerGraph, styles);
reducerGraph = registerReducer(reducerGraph, {
  reducer: countParticles,
  exportedKeys: ['aliveParticleCount'],
  importedKeys: ['particles']
});

// export root reducer bound with the sorted reducer array
export default pipeReduce.bind(null, getReducers(reducerGraph));

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


function countParticles(state: GlobalStateType): GlobalStateType {
  return {
    ...state,
    aliveParticleCount: state.particles.filter((p: ParticleType): boolean => !p.isToBeDestroyed).length
  };
}
