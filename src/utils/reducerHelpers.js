import type {RulesType} from 'constant/Types';

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

export function reduceNestedState(state: Object, reducers: RulesType, rootState?: Object): Object {
  return Object.keys(state).reduce((memo: Object, key: string): Object => {
    const value = state[key];
    const reducer = reducers[key];

    if (typeof value === 'object' && typeof reducer === 'object') {
      memo[key] = reduceNestedState(value, reducer, rootState ? rootState : state);
    } else {
      memo[key] = reducer ? reducer(rootState, value) : value;
    }
    return memo;
  }, {});
}
