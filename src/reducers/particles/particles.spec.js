import * as actions from 'actions/Actions';
import {initiateStateWithStyles} from 'reducers/styles/styles.spec';
import {particles} from 'reducers/particles';
import {assert} from 'chai';
import {stub} from 'sinon';

// returns the amount of particles not scheduled for destruction
function countAliveParticles(particles: array): number {
  return particles.filter((p: ParticleType) => !p.isToBeDestroyed).length;
}

describe('particles reducer', () => {
  it('returns initial state', () => {
    const state = particles(initiateStateWithStyles('testStyle1', 'testStyle2'),
      {type: null});
    assert.isObject(state);
    assert.equal(countAliveParticles(state.particles), 0);
    assert.deepEqual(state.particles, []);
  });

  it('updates a piece of state on moveParticle using a reducer defined in rules', () => {
    const oldState = {
      ...initiateStateWithStyles('testStyle1', 'testStyle2'),

      particles: [{
        sn: 0,
        styleName: 'testStyle1',
        rules: {
          sn: (state: Object, value: number) => value+1,
        }
      }]
    };
    const state = particles(oldState, actions.moveParticle());
    assert.equal(state.particles[0].sn, 1);
  });

  it('adds particles on addParticle', () => {
    let state;

    // first pass
    state = particles(initiateStateWithStyles('testStyle1', 'testStyle2'),
      actions.addParticle(2, 'testStyle1'));
    assert.equal(countAliveParticles(state.particles), 2);
    assert.equal(state.particles[0].styleName, 'testStyle1');

    // second pass
    state = particles(state, actions.addParticle(3, 'testStyle2'));
    assert.equal(countAliveParticles(state.particles), 5);
    assert.equal(state.particles[0].styleName, 'testStyle1');
    assert.equal(state.particles[2].styleName, 'testStyle2');
  });

  it('schedules a specific particle for deletion on deleteParticle', () => {
    let state;

    // first pass
    state = particles(initiateStateWithStyles('testStyle1', 'testStyle2'),
      actions.addParticle(3, 'testStyle1'));

    // second pass
    const deletedId = state.particles[1].id;
    state = particles(state, actions.deleteParticle(state.particles[1].id));
    assert.equal(state.particles.length, 3);
    assert.equal(countAliveParticles(state.particles), 2);
    assert.equal(state.particles[1].id, deletedId);
    assert.equal(state.particles[1].isToBeDestroyed, true);
  });

  it('schedules a number of particles for deletion on deleteSomeParticles', () => {
    let state;

    // first pass
    state = particles(initiateStateWithStyles('testStyle1', 'testStyle2'),
      actions.addParticle(5, 'testStyle1'));

    // second pass
    const deletedId = state.particles[1].id;
    state = particles(state, actions.deleteSomeParticles(2));
    assert.equal(state.particles.length, 5);
    assert.equal(countAliveParticles(state.particles), 3);
    const toBeDestroyedCount = state.particles.filter((p: Object) => p.isToBeDestroyed).length;
    assert.equal(toBeDestroyedCount, 2);
  });

  it('reduces state based on style rules on moveParticle', () => {
    let reducedState;

    // first pass
    const firstState = particles(initiateStateWithStyles({
      name: 'testStyle1',
      initialState: {
        testThing: 0,
      },
      rules: {
        testThing: (s: string, v: number) => v + 1,
      }
    }), actions.addParticle(1, 'testStyle1'));

    reducedState = particles(firstState,  actions.moveParticle());
    assert.equal(reducedState.particles[0].testThing, 1);

    reducedState = particles(reducedState, actions.moveParticle());
    assert.equal(reducedState.particles[0].testThing, 2);

    reducedState = particles(reducedState, actions.moveParticle());
    assert.equal(reducedState.particles[0].testThing, 3);
  });
});
