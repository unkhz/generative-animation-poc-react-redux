// @flow
import type {RuleType, ParticleType, GlobalStateType, ActionType} from 'constants/Types';


export function isNotConstrained(value: number, min: number, max: number): boolean {
  return value < min || value > max;
}

export function constrain(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function gradualConstrain(originalValue: number, deltaValue: number, min: number, max: number, nudgeAmount: number): number {
  let modifiedValue =  originalValue + deltaValue;
  if (modifiedValue > max) {
    return Math.max(originalValue - nudgeAmount, max);
  } else if (modifiedValue < min) {
    return Math.min(originalValue + nudgeAmount, min);
  } else {
    return modifiedValue;
  }
}

export function rand(slowness: number): number {
  if (typeof slowness !== 'number') {
    throw Error('Invalid slowness ' + typeof slowness);
  }
  return (Math.random()-0.5) / slowness;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

export function reduceNestedState(state: ParticleType, rules: RuleType[], rootState?: Object): Object {
  return rules.reduce((memo: Object, [key, reducer]: [string, Function]): Object => {
    const [rootKey, ...descendantKeys] = key.split('.');
    const value = memo[rootKey];
    rootState = rootState || state;

    if (value === undefined) {
      console.warn('No value in state for', key);
    } else if (descendantKeys.length > 0) {
      memo[rootKey] = {
        ...value,
        ...reduceNestedState(value, [[descendantKeys.join('.'), reducer]], rootState)
      };
    } else {
      memo[rootKey] = reducer(rootState, value);
    }
    return memo;
  }, state);
}

/**
 * Check if a part of the global state has been initialised and return initialState if not
 */
export function initPartialState(state: GlobalStateType, initialState: GlobalStateType, testProp: string): GlobalStateType {
  if (state === undefined || state[testProp] === undefined) {
    return {
      ...state,
      ...initialState
    };
  } else {
    return state;
  }
}
