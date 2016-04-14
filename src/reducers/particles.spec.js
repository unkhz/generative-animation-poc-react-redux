import * as actions from 'actions/Actions';
import * as actionTypes from 'constants/ActionTypes';
import {particles} from 'reducers/particles';
import {assert} from 'chai';
import {stub} from 'sinon';

describe('particles reducer', () => {
  it('returns initial state', () => {
    const state = particles(undefined, {type: null});
    assert.isObject(state);
    assert.equal(state.count, 0);
    assert.deepEqual(state.particles, []);
  });

  it('updates a piece of state on moveParticle using a reducer defined in moveRules', () => {
    const oldState = {
      particles: [{
        sn: 0,
        moveRules: {
          sn: (state: Object, value: number) => value+1,
        }
      }]
    };
    const state = particles(oldState, {
      type: actionTypes.MOVE_PARTICLE
    });
    assert.equal(state.particles[0].sn, 1);
  });

  it('adds particles on addParticle', () => {
    let state;

    // first pass
    state = particles(undefined, {
      type: actionTypes.ADD_PARTICLE,
      count: 2,
      moveRules: {
        sn: 'fakeFunction',
      }
    });
    assert.equal(state.count, 2);
    assert.equal(state.particles[0].moveRules.sn, 'fakeFunction');

    // second pass
    state = particles(state, {
      type: actionTypes.ADD_PARTICLE,
      count: 3,
      moveRules: {
        sn: 'fakeFunction2',
      }
    });
    assert.equal(state.count, 5);
    assert.equal(state.particles[0].moveRules.sn, 'fakeFunction');
    assert.equal(state.particles[2].moveRules.sn, 'fakeFunction2');
  });

  it('schedules a specific particle for deletion on deleteParticle', () => {
    let state;

    // first pass
    state = particles(undefined, {
      type: actionTypes.ADD_PARTICLE,
      count: 3
    });

    // second pass
    const deletedId = state.particles[1].id;
    state = particles(state, {
      type: actionTypes.DELETE_PARTICLE,
      id: state.particles[1].id
    });
    assert.equal(state.count, 2);
    assert.equal(state.particles.length, 3);
    assert.equal(state.particles[1].id, deletedId);
    assert.equal(state.particles[1].isToBeDestroyed, true);
  });

  it('schedules a number of particles for deletion on deleteSomeParticles', () => {
    let state;

    // first pass
    state = particles(undefined, {
      type: actionTypes.ADD_PARTICLE,
      count: 5
    });

    // second pass
    const deletedId = state.particles[1].id;
    state = particles(state, {
      type: actionTypes.DELETE_SOME_PARTICLES,
      count: 2
    });
    assert.equal(state.count, 3);
    assert.equal(state.particles.length, 5);
    const toBeDestroyedCount = state.particles.filter((p: Object) => p.isToBeDestroyed).length;
    assert.equal(toBeDestroyedCount, 2);
  });

  it('reduces state based on individual Rules on moveParticle', () => {
    let reducedState;

    // first pass
    const firstState = particles(undefined, actions.addParticle(1));

    // nth pass (second pass has speed 0)
    reducedState = particles(firstState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});
    reducedState = particles(reducedState, {type: actionTypes.MOVE_PARTICLE});

    const firstParticle = firstState.particles[0];
    const reducedParticle = reducedState.particles[0];

    Object.keys(reducedParticle.transform).forEach((prop: string) => {
      const val = reducedParticle.transform[prop];
      assert.notEqual(val, firstParticle.transform[prop]);
    });
  });
});
