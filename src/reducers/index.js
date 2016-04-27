// @flow
import {initPartialState} from 'utils/reducerHelpers';
import type {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import * as environment from './environment';
import * as layers from './layers';
import * as particles from './particles';
import * as styles from './styles';
import {createReducerGraph, registerReducer, getReducers} from 'utils/reducerGraph';
import type {ReducerDefinitionType} from 'utils/reducerGraph';


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
  exportedKey: 'aliveParticleCount',
  importedKeys: ['particles']
});

// export root reducer bound with the sorted reducer definition array
export default combineReducersFromDefinitions.bind(null, getReducers(reducerGraph));

function combineReducersFromDefinitions(reducerDefinitions: ReducerDefinitionType[], previousState: GlobalStateType, action: ActionType): GlobalStateType {
  return reducerDefinitions.reduce((nextState: GlobalStateType, {reducer, exportedKey, importedKeys}: ReducerDefinitionType): GlobalStateType => {
    nextState[exportedKey] = reducer(
      previousState[exportedKey],
      action,
      importedKeys.map((key: string): any => nextState[key])
    );
    return nextState;
  }, {});
}


function countParticles(aliveParticleCount: number, action: ActionType, [particles]: [ParticleType[]]): number {
  return particles.filter((p: ParticleType): boolean => !p.isToBeDestroyed).length;
}
