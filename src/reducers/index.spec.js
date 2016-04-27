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
    assert.isArray(state.particles);
  });
  it('produces styles', () => {
    const state = rootReducer({}, initAction);
    assert.isArray(state.styles);
  });
  it('produces env', () => {
    const state = rootReducer({}, initAction);
    assert.isObject(state.env);
    assert.isNumber(state.env.radius);
    assert.isNumber(state.env.width);
    assert.isNumber(state.env.height);
    assert.isBoolean(state.env.isMovementPaused);
  });
  it('produces aliveParticleCount', () => {
    const state = rootReducer({}, initAction);
    assert.isNumber(state.aliveParticleCount);
  });
});
