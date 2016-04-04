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
