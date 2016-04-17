import rootReducer from './index';

const initAction = {
  type: '@@redux/INIT'
};

describe('rootReducer', () => {
  it('produces layers', () => {
    const state = rootReducer({}, initAction);
    assert.isArray(state.layers);
  });
  it('produces particles', () => {
    const state = rootReducer({}, initAction);
    assert.isBoolean(state.isPaused);
    assert.isArray(state.particles);
  });
  it('produces env', () => {
    const state = rootReducer({}, initAction);
    assert.isObject(state.env);
    assert.isNumber(state.env.radius);
  });
  it('produces aliveParticleCount', () => {
    const state = rootReducer({}, initAction);
    assert.isNumber(state.aliveParticleCount);
  });
});
