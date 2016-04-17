import rootReducer from './index';

const initAction = {
  type: '@@redux/INIT'
};

describe('rootReducer', () => {
  it('contains layers from partial reducers', () => {
    const state = rootReducer({}, initAction);
    assert.isArray(state.layers);
  });
  it('contains particles from partial reducers', () => {
    const state = rootReducer({}, initAction);
    assert.isNumber(state.aliveParticleCount);
    assert.isBoolean(state.isPaused);
    assert.isArray(state.particles);
  });
});
