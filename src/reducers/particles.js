import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';

let particleId = 0;
function createParticle({moveRules}) {
  return {
    id: particleId++,
    sn: 0,
    isToBeDestroyed: false,
    style: {
      opacity: 0,
    },
    transform: {
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
  count: 0,
  particles: []
};

export function particles(state = initialState, action) {
  switch (action.type) {

    case actionTypes.MOVE_PARTICLE:
      return {
        ...state,
        particles: state.particles
        .map((particle) => reduceNestedState(particle, particle.moveRules))
        .filter((particle) => !particle.isToBeDestroyed || particle.style.opacity > 0)
      };

    case actionTypes.ADD_PARTICLE:
      return addParticle(state, action);

    case actionTypes.DELETE_PARTICLE:
      return deleteParticle(state, action);

    case actionTypes.DELETE_SOME_PARTICLES:
      return deleteSomeParticles(state, action);

    default:
      return state;
  }
}

function addParticle(state, action) {
  const particles = [
    ...state.particles,
    ...Array.apply(null, {length: action.count || 1}).map(() => {
      return createParticle({
        moveRules: action.moveRules
      });
    })
  ];
  return {
    particles,
    count: countParticles(particles)
  };
}

function deleteParticle(state, action) {
  const particles = state.particles.map((particle) => {
    if (particle.id === action.id) {
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
  return {
    particles,
    count: countParticles(particles)
  };
}

function deleteSomeParticles(state, action) {
  let count = action.count;
  const particles = state.particles.map((particle) => {
    if (!particle.isToBeDestroyed && count > 0) {
      count--;
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
  return {
    particles,
    count: countParticles(particles)
  };
}

function countParticles(particles) {
  return particles.filter((p) => !p.isToBeDestroyed).length;
}
