import * as actions from 'actions/Actions';
import {createStyle, initiateStateWithStyles} from 'reducers/styles/styles.spec';
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
    const style = createStyle('testStyle1')
    const oldState = {
      ...initiateStateWithStyles(style),
      particles: [{
        sn: 0,
        styleName: 'testStyle1',
        ...style.getInitialState(),
        rules: [
          ['sn', (state: Object, value: number) => value+1],
        ]
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
    let reducedState = particles(initiateStateWithStyles({
      name: 'testStyle1',
      getInitialState: () => ({
        testThing: 0,
        nested: {
          thing: '',
          testing: {
            thing: [99, 'bugs'],
            otherThing: false,
          }
        }
      }),
      rules: [
        ['testThing', (s: string, v: StyleValueType) => v + 1],
        ['nested.testing.thing', (s: string, [value, unit]: StyleValueType) => [value - 1, unit]],
        ['nested.testing.otherThing', (s: string, value: StyleValueType) => !value],
        ['nested.thing', (s: string, value: StyleValueType) => value + '.'],
      ]
    }), actions.addParticle(1, 'testStyle1'));

    reducedState = particles(reducedState,  actions.moveParticle());
    assert.equal(reducedState.particles[0].testThing, 1);
    assert.equal(reducedState.particles[0].nested.thing, '.');
    assert.deepEqual(reducedState.particles[0].nested.testing.thing, [98, 'bugs']);
    assert.equal(reducedState.particles[0].nested.testing.otherThing, true);

    reducedState = particles(reducedState, actions.moveParticle());
    assert.equal(reducedState.particles[0].nested.thing, '..');
    assert.equal(reducedState.particles[0].testThing, 2);
    assert.deepEqual(reducedState.particles[0].nested.testing.thing, [97, 'bugs']);
    assert.equal(reducedState.particles[0].nested.testing.otherThing, false);

    reducedState = particles(reducedState, actions.moveParticle());
    assert.equal(reducedState.particles[0].nested.thing, '...');
    assert.equal(reducedState.particles[0].testThing, 3);
    assert.deepEqual(reducedState.particles[0].nested.testing.thing, [96, 'bugs']);
    assert.equal(reducedState.particles[0].nested.testing.otherThing, true);

  });
});
