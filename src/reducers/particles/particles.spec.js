import * as actions from 'actions/Actions';
import {createStyle, mockStyles} from 'reducers/styles/mock';
import {particles} from 'reducers/particles';
import {assert} from 'chai';
import {stub} from 'sinon';

// returns the amount of particles not scheduled for destruction
function countAliveParticles(particles: array): number {
  return particles.filter((p: ParticleType): boolean => !p.isToBeDestroyed).length;
}

const initAction = {
  type: '@@redux/INIT'
};

const envMock = {
  width: 100,
  height: 100,
  radius: 100,
  isMovementPaused: false,
};

function mockDependencies(): [EnvironmentType, StyleType[]]  {
  return [
    envMock,
    mockStyles(...arguments)
  ];
}

describe('particles reducer', () => {
  it('returns initial state', () => {
    const state = particles(undefined, initAction, {});
    assert.isArray(state);
    assert.equal(countAliveParticles(state), 0);
    assert.deepEqual(state, []);
  });

  it('adds particles on addParticle', () => {
    let state;
    const mock = mockDependencies('testStyle1', 'testStyle2');
    // first pass
    state = particles(undefined, actions.addParticle(2, 'testStyle1'), mock);
    assert.equal(countAliveParticles(state), 2);
    assert.equal(state[0].styleName, 'testStyle1');

    // second pass
    state = particles(state, actions.addParticle(3, 'testStyle2'), mock);
    assert.equal(countAliveParticles(state), 5);
    assert.equal(state[0].styleName, 'testStyle1');
    assert.equal(state[2].styleName, 'testStyle2');
  });

  it('updates a piece of state on moveParticle using a reducer defined in rules', () => {
    let state;
    state = particles(undefined, actions.addParticle(1, 'testStyle1'),
      mockDependencies('testStyle1'));
    assert.equal(state[0].sn, 0);

    state = particles(state, actions.moveParticle(),
      mockDependencies('testStyle1'));
    assert.equal(state[0].sn, 1);
  });

  it('schedules a specific particle for deletion on deleteParticle', () => {
    let state;

    // first pass
    console.log(particles);
    state = particles(undefined, actions.addParticle(3, 'testStyle1'),
      mockDependencies('testStyle1', 'testStyle2'));

    // second pass
    const deletedId = state[1].id;
    state = particles(state, actions.deleteParticle(state[1].id),
      mockDependencies('testStyle1', 'testStyle2'));
    assert.equal(state.length, 3);
    assert.equal(countAliveParticles(state), 2);
    assert.equal(state[1].id, deletedId);
    assert.equal(state[1].isToBeDestroyed, true);
  });

  it('schedules a number of particles for deletion on deleteSomeParticles', () => {
    let state;

    // first pass
    state = particles(undefined, actions.addParticle(5, 'testStyle1'),
      mockDependencies('testStyle1', 'testStyle2'));

    // second pass
    const deletedId = state[1].id;
    state = particles(state, actions.deleteSomeParticles(2),
      mockDependencies('testStyle1', 'testStyle2'));
    assert.equal(state.length, 5);
    assert.equal(countAliveParticles(state), 3);
    const toBeDestroyedCount = state.filter((p: Object): boolean => p.isToBeDestroyed).length;
    assert.equal(toBeDestroyedCount, 2);
  });

  it('reduces state based on style rules on moveParticle', () => {
    let state;
    const mock = mockDependencies({
      name: 'testStyle1',
      getInitialState: (): Object => ({
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
        ['testThing', (s: string, v: StyleValueType): StyleValueType => v + 1],
        ['nested.testing.thing', (s: string, [value, unit]: StyleValueType): StyleValueType => [value - 1, unit]],
        ['nested.testing.otherThing', (s: string, value: StyleValueType): StyleValueType => !value],
        ['nested.thing', (s: string, value: StyleValueType): StyleValueType => value + '.'],
      ]
    });

    state = particles(undefined, actions.addParticle(1, 'testStyle1'), mock);
    state = particles(state,  actions.moveParticle(), mock);
    assert.equal(state[0].testThing, 1);
    assert.equal(state[0].nested.thing, '.');
    assert.deepEqual(state[0].nested.testing.thing, [98, 'bugs']);
    assert.equal(state[0].nested.testing.otherThing, true);

    state = particles(state, actions.moveParticle(), mock);
    assert.equal(state[0].nested.thing, '..');
    assert.equal(state[0].testThing, 2);
    assert.deepEqual(state[0].nested.testing.thing, [97, 'bugs']);
    assert.equal(state[0].nested.testing.otherThing, false);

    state = particles(state, actions.moveParticle(), mock);
    assert.equal(state[0].nested.thing, '...');
    assert.equal(state[0].testThing, 3);
    assert.deepEqual(state[0].nested.testing.thing, [96, 'bugs']);
    assert.equal(state[0].nested.testing.otherThing, true);

  });
});
