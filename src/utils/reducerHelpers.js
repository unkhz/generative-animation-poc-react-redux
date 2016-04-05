export function constrain(value, min, max) {
  if (typeof value !== 'number') {
    throw Error('Cannot constrain ' + typeof value);
  }
  return Math.min(max, Math.max(min, value));
}

export function rand(slowness) {
  if (typeof slowness !== 'number') {
    throw Error('Invalid slowness ' + typeof slowness);
  }
  return (Math.random()-0.5) / slowness;
}

export function reduceNestedState(state, reducers, rootState=false) {
  return Object.keys(state).reduce((memo, key) => {
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
