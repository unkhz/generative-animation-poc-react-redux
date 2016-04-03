import * as types from '../constants/ActionTypes';

const defaultParticleState = {
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
    perspective: 0,
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

function constrain(value, min, max) {
  if (typeof value !== 'number') {
    throw Error('Cannot constrain ' + typeof value);
  }
  return Math.min(max, Math.max(min, value));
}

function rand(slowness) {
  if (typeof slowness !== 'number') {
    throw Error('Invalid slowness ' + typeof slowness);
  }
  return (Math.random()-0.5) / slowness;
}

const modifiers = {
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

function iterateParticleState(state, modifiers, rootState=false) {
  return Object.keys(state).reduce((memo, key) => {
    const value = state[key];
    const modifier = modifiers[key];

    if (typeof value === 'object' && typeof modifier === 'object') {
      memo[key] = iterateParticleState(value, modifier, rootState ? rootState : state);
    } else {
      memo[key] = modifier ? modifier(rootState, value) : value;
    }
    return memo;
  }, {});
}

var particleId = 0;
function createParticle() {
  particleId++;
  return {
    style: Object.assign({}, defaultParticleState.style),
    transform: Object.assign({}, defaultParticleState.transform),
    speed: Object.assign({}, defaultParticleState.speed),
    unit: Object.assign({}, defaultParticleState.unit),
    id: particleId,
  };
}

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
    case types.MOVE_PARTICLE:
      return state.map((particle) => {
        return particle.id === action.id ? iterateParticleState(particle, modifiers) : particle;
      });
    case types.ADD_PARTICLE:
      return [
        createParticle(),
        ...state
      ];
    case types.DELETE_PARTICLE:
      return state.filter((particle) => particle.id !== action.id);
    default:
      return state;
  }
}
