import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';
import * as actionTypes from '../constants/ActionTypes';

let particleId = 0;
function createParticle(rules) {
  return {
    id: particleId++,
    sn: 0,
    isToBeDestroyed: 0,
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
    ...rules
  };
}

export function particles(state = [], action) {
  switch (action.type) {

    case actionTypes.MOVE_PARTICLE:
      return state
        .map((particle) => reduceNestedState(particle, particle.moveRules))
        .filter((particle) => !particle.isToBeDestroyed || particle.style.opacity > 0);

    case actionTypes.ADD_PARTICLE:
      return [
        ...Array.apply(null, {length: action.count || 1}).map(() => {
          return createParticle({
            moveRules: action.moveRules,
            mouseMoveRules: action.mouseMoveRules
          });
        }),
        ...state
      ];

    case actionTypes.DELETE_PARTICLE:
      return state.map((particle) => {
        if (particle.id === action.id) {
          particle.isToBeDestroyed = true;
        }
        return particle;
      });

    case actionTypes.DELETE_SOME_PARTICLES:
      let count = action.count;
      return state.map((particle) => {
        if (!particle.isToBeDestroyed && count > 0) {
          count--;
          particle.isToBeDestroyed = true;
        }
        return particle;
      });

    default:
      return state;
  }
}
