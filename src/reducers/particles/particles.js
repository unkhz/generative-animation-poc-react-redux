// @flow
import { rand, constrain, reduceNestedState, initPartialState } from 'utils/reducerHelpers';
import * as actionTypes from 'constants/ActionTypes';
import {RulesType, ParticleType, ParticleCollectionType, ActionType, GlobalStateType} from 'constants/Types';

let particleId = 0;
function createParticle({moveRules}: {[id: string]: RulesType}): ParticleType {
  return {
    id: particleId++,
    sn: 0,
    isToBeDestroyed: false,
    style: {
      opacity: 0,
    },
    env: {
      radius: 100
    },
    transform: {
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    },
    speed: {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      opacity: 0,
      general: 0,
      slow: 0,
    },
    unit: {
      translateX: 'px',
      translateY: 'px',
      translateZ: 'px',
      scaleX: '',
      scaleY: '',
      scaleZ: '',
      rotateX: 'deg',
      rotateY: 'deg',
      rotateZ: 'deg',
      opacity: '',
    },
    moveRules
  };
}

const initialState = {
  env: {
    radius: 100,
  },
  isPaused: false,
  particles: []
};

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

function moveParticle(state: ParticleCollectionType, action: ActionType): ParticleCollectionType {
  let particles = state.particles;

  if (!state.isPaused) {
    particles = state.particles.map((particle: ParticleType): ParticleType => {
      return reduceNestedState({
        ...particle,
        env: state.env || particle.env,
      }, particle.moveRules);
    });
  }

  return {
    ...state,
    particles: particles.filter((particle: ParticleType) => !particle.isToBeDestroyed || particle.style.opacity > 0)
  };
}

function addParticle(state: ParticleCollectionType, action: ActionType): ParticleCollectionType {
  const particles = [
    ...state.particles,
    // $FlowFixMe: Can't cope with Array.apply
    ...Array.apply(null, {length: action.count}).map((): ParticleType  => {
      return createParticle({
        moveRules: action.moveRules
      });
    })
  ];
  return {
    ...state,
    particles,
  };
}

function deleteParticle(state: ParticleCollectionType, action: ActionType): ParticleCollectionType {
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

function deleteSomeParticles(state: ParticleCollectionType, action: ActionType): ParticleCollectionType {
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
