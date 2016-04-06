import { rand, constrain, reduceNestedState } from '../utils/reducerHelpers';

export const particleMoveRules = {
  sn: (state, value) => value+1,
  style: {
    opacity: (state, value) => {
      if (state.isToBeDestroyed) {
        return Math.max(value - 0.005, 0);
      } else {
        return constrain(value + state.speed.opacity, Math.min(value,0.11), 0.22);
      }
    }
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
    slow: (state, value) => constrain(value + rand(1000),-0.005,0.005),
    general: (state, value) => constrain(value + rand(1000),-0.05,0.05),
    rotateX: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateY: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateZ: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateX: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateY: (state, value) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateZ: (state, value) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
    opacity: (state, value) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
  }
};
