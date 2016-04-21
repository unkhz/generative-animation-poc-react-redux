// @flow
import { rand, constrain, reduceNestedState, initPartialState } from 'utils/reducerHelpers';
import * as actionTypes from 'constants/ActionTypes';
import {RuleType, ParticleType, ActionType, StyleType, StyleValueType, GlobalStateType} from 'constants/Types';

let particleId = 0;
export function createParticle(style: StyleType, state: GlobalStateType): ParticleType {
  return {
    id: particleId++,
    sn: 0,
    isToBeDestroyed: false,
    styleName: style.name,
    ...style.getInitialState(state),
    rules: [
      ...style.rules,
      ['sn', (state: StyleType, value: StyleValueType) => value+1],
      ['isToBeDestroyed', (state: StyleType, value: StyleValueType) => !!state.isToBeDestroyed || !!state.shouldBeDestroyed],
    ],
    // intentionally reference rather than clone
    unit: style.unit
  };
}

const initialState = {
  env: {
    radius: 100,
  },
  isPaused: false,
  particles: []
};

function getStyle(state: GlobalStateType, name: string): StyleType {
  const style = state.styles.filter((style: StyleType): StyleType => {
    return style.name === name;
  })[0];

  if (!style) {
    throw new Error(`Invalid style ${name}`);
  }
  return style;
}

export function particles(state: GlobalStateType, action: ActionType): GlobalStateType {
  state = initPartialState(state, initialState, 'particles');

  switch (action.type) {

    case actionTypes.MOVE_PARTICLE:
      return moveParticle(state, action);

    case actionTypes.ADD_PARTICLE:
      return addParticle(state, action);

    case actionTypes.DELETE_PARTICLE:
      return deleteParticle(state, action);

    case actionTypes.DELETE_SOME_PARTICLES:
      return deleteSomeParticles(state, action);

    case actionTypes.TOGGLE_ANIMATION:
      return {
        ...state,
        isPaused: !state.isPaused
      };

    default:
      return state;
  }
}

function moveParticle(state: GlobalStateType, action: ActionType): GlobalStateType {
  let particles = state.particles;

  if (!state.isPaused) {
    particles = state.particles.map((particle: ParticleType): ParticleType => {
      return reduceNestedState({
        ...particle,
        env: state.env || particle.env,
      }, particle.rules);
    });
  }

  return {
    ...state,
    particles: particles.filter((particle: ParticleType) => !particle.isToBeDestroyed || particle.style.opacity > 0)
  };
}

function addParticle(state: GlobalStateType, action: ActionType): GlobalStateType {
  const particles = [
    ...state.particles,
    // $FlowFixMe: Can't cope with Array.apply
    ...Array.apply(null, {length: action.count}).map((): ParticleType  => {
      return createParticle(getStyle(state, action.styleName), state);
    })
  ];
  return {
    ...state,
    particles,
  };
}

function deleteParticle(state: GlobalStateType, action: ActionType): GlobalStateType {
  const particles = state.particles.map((particle: ParticleType): ParticleType => {
    if (particle.id === action.id) {
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
  return {
    ...state,
    particles,
  };
}

function deleteSomeParticles(state: GlobalStateType, action: ActionType): GlobalStateType {
  let count = action.count;
  const particles = state.particles.map((particle: ParticleType): ParticleType => {
    if (!particle.isToBeDestroyed && count > 0) {
      count--;
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
  return {
    ...state,
    particles,
  };
}
