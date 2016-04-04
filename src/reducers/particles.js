import { rand, constrain } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';

const defaultParticleState = {
  sn: 0,
  frameRequestId: 0,
  style: {
    opacity: 0.33,
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
    rotateX: 'deg',
    rotateY: 'deg',
    rotateZ: 'deg',
    opacity: '',
  }
};

var particleId = 0;
function createParticle() {
  particleId++;
  return {
    sn: defaultParticleState.sn,
    frameRequestId: defaultParticleState.frameRequestId,
    style: Object.assign({}, defaultParticleState.style),
    transform: Object.assign({}, defaultParticleState.transform),
    speed: Object.assign({}, defaultParticleState.speed),
    unit: Object.assign({}, defaultParticleState.unit),
    id: particleId,
  };
}

function reduceParticleState(state, reducers, rootState=false) {
  return Object.keys(state).reduce((memo, key) => {
    const value = state[key];
    const modifier = reducers[key];

    if (typeof value === 'object' && typeof modifier === 'object') {
      memo[key] = reduceParticleState(value, modifier, rootState ? rootState : state);
    } else {
      memo[key] = modifier ? modifier(rootState, value) : value;
    }
    return memo;
  }, {});
}

const reducers = {
  sn: (state, value) => (value+1),
  style: {
    opacity: (state, value) => constrain(value + state.speed.opacity, 0.11, 0.44)
  },
  transform: {
    translateX: (state, value) => constrain(value + state.speed.translateX, -100, 100),
    translateY: (state, value) => constrain(value + state.speed.translateY, -100, 100),
    translateZ: (state, value) => constrain(value + state.speed.translateZ, -100, 100),
    rotateX: (state, value) => value + state.speed.rotateX,
    rotateY: (state, value) => value + state.speed.rotateY,
    rotateZ: (state, value) => value + state.speed.rotateZ,
  },
  speed: {
    slow: (state, value) => constrain(value +  + rand(1000),-0.005,0.005),
    general: (state, value) => constrain(value +  + rand(100),-0.5,0.5),
    rotateX: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateY: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateZ: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateX: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateY: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateZ: (state, value) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
    opacity: (state, value) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
  }
};

const initialState = [
  createParticle(),
  createParticle(),
  createParticle(),
  createParticle(),
  createParticle(),
  createParticle(),
  createParticle(),
];

export function particles(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MOVE_PARTICLE:
      return state.map((particle) => {
        return particle.id === action.id ? reduceParticleState(particle, reducers) : particle;
      });
    case actionTypes.PARTICLE_MOVE_REQUESTED:
      return state.map((particle) => {
        if (particle.id === action.particleId) {
          return Object.assign({}, particle, {
            frameRequestId: action.frameRequestId
          });
        } else {
          return particle;
        }
      });
    case actionTypes.ADD_PARTICLE:
      return [
        createParticle(),
        ...state
      ];
    case actionTypes.DELETE_PARTICLE:
      return state.filter((particle) => particle.id !== action.id);
    default:
      return state;
  }
}
