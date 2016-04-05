import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';

let particleId = 0;
function createParticle() {
  return {
    id: particleId++,
    sn: 0,
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
      rotateX: 'deg',
      rotateY: 'deg',
      rotateZ: 'deg',
      opacity: '',
    }
  };
}

const reducers = {
  sn: (state, value) => value+1,
  style: {
    opacity: (state, value) => constrain(value + state.speed.opacity, Math.min(value,0.11), 0.22)
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

const initialState = Array.apply(null, {length: 16}).map(() => createParticle());

export function particles(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MOVE_PARTICLE:
      return state.map((particle) => {
        return reduceNestedState(particle, reducers);
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
