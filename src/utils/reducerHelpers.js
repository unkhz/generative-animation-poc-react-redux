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

/**
 * Reduce nested state according to a collection of rules (partial reducers)
 */
export function reduceNestedState(state: ParticleType, rules: RuleType[], rootState?: Object, rootPath?: string): Object {
  return rules.reduce((memo: Object, [path, reducer]: [string, Function]): Object => {
    const [key, ...descendantKeys] = path.split('.');
    const value = memo[key];
    const branchState = rootState || state;
    const branchPath = rootPath || path;

    if (value === undefined) {
      throw new Error(`No value in state for ${branchPath}`);
    } else if (descendantKeys.length > 0) {
      memo[key] = {
        ...value,
        ...reduceNestedState(value, [[descendantKeys.join('.'), reducer]], branchState, branchPath)
      };
    } else {
      memo[key] = reducer(branchState, value);
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
