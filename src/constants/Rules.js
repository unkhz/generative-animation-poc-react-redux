import { rand, constrain, reduceNestedState, gradualConstrain } from 'utils/reducerHelpers';
import type {ParticleType} from 'constants/Types';

type ValueType = number | string;

export const particleMoveRules = {
  sn: (state: ParticleType, value: ValueType) => value+1,
  style: {
    opacity: (state: ParticleType, value: ValueType): ValueType => {
      if (state.isToBeDestroyed) {
        return Math.max(value - 0.005, 0);
      } else {
        return constrain(value + state.speed.opacity, Math.min(value,0.11), 0.22);
      }
    }
  },
  transform: {
    scaleX: (state: ParticleType, value: ValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
    scaleY: (state: ParticleType, value: ValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
    scaleZ: (state: ParticleType, value: ValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
    translateX: (state: ParticleType, value: ValueType) => gradualConstrain(value, state.speed.translateX, -state.env.radius/3, state.env.radius/3, 0.1),
    translateY: (state: ParticleType, value: ValueType) => gradualConstrain(value, state.speed.translateY, -state.env.radius/3, state.env.radius/3, 0.1),
    translateZ: (state: ParticleType, value: ValueType) => gradualConstrain(value, state.speed.translateZ, -state.env.radius/3, state.env.radius/3, 0.1),
    rotateX: (state: ParticleType, value: ValueType) => value + state.speed.rotateX,
    rotateY: (state: ParticleType, value: ValueType) => value + state.speed.rotateY,
    rotateZ: (state: ParticleType, value: ValueType) => value + state.speed.rotateZ,
  },
  speed: {
    slow: (state: ParticleType, value: ValueType) => constrain(value + rand(1000),-0.005,0.005),
    general: (state: ParticleType, value: ValueType) => constrain(value + rand(100),-0.5,0.5),
    rotateX: (state: ParticleType, value: ValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateY: (state: ParticleType, value: ValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    rotateZ: (state: ParticleType, value: ValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateX: (state: ParticleType, value: ValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateY: (state: ParticleType, value: ValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
    translateZ: (state: ParticleType, value: ValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
    opacity: (state: ParticleType, value: ValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
  }
};
