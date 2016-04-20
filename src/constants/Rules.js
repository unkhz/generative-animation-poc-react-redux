import { rand, constrain, reduceNestedState, gradualConstrain } from 'utils/reducerHelpers';
import type {StyleType, StyleValueType} from 'constants/Types';

export function frontRotaterStyleFactory(): StyleType {
  return {
    name: 'frontRotater',
    getInitialState: (): Object => {
      return {
        style: {
          opacity: 0,
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
      };
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
    rules: {
      style: {
        opacity: (state: StyleType, value: StyleValueType): StyleValueType => {
          if (state.isToBeDestroyed) {
            return Math.max(value - 0.005, 0);
          } else {
            return constrain(value + state.speed.opacity, Math.min(value,0.11), 0.22);
          }
        }
      },
      transform: {
        scaleX: (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
        scaleY: (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
        scaleZ: (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033),
        translateX: (state: StyleType, value: StyleValueType) => gradualConstrain(value, state.speed.translateX, -state.env.radius/10, state.env.radius/10, 0.1),
        translateY: (state: StyleType, value: StyleValueType) => gradualConstrain(value, state.speed.translateY, -state.env.radius/10, state.env.radius/10, 0.1),
        translateZ: (state: StyleType, value: StyleValueType) => gradualConstrain(value, state.speed.translateZ, -state.env.radius/10, state.env.radius/10, 0.1),
        rotateX: (state: StyleType, value: StyleValueType) => value + state.speed.rotateX,
        rotateY: (state: StyleType, value: StyleValueType) => value + state.speed.rotateY,
        rotateZ: (state: StyleType, value: StyleValueType) => value + state.speed.rotateZ,
      },
      speed: {
        slow: (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005),
        general: (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5),
        rotateX: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        rotateY: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        rotateZ: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        translateX: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        translateY: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        translateZ: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
        opacity: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
      }
    }
  };
}

export function backBlinkerStyleFactory(): StyleType {
  return {
    name: 'backBlinker',
    getInitialState: (state: GlobalStateType): Object => {
      const x = rand(1) * state.env.width;
      const y = rand(1) * state.env.height;
      const scale = 1/4000 - rand(1000);
      return {
        style: {
          opacity: 0,
          marginLeft: x - 150,
          marginTop: y - 150,
        },
        transform: {
          scale,
          rotateZ: 0,
          translateZ: 0,
        },
        const: {
          scale,
        },
        speed: {
          rotateZ: 0,
          opacity: 0,
          general: 0,
          slow: 0,
        },
      };
    },
    unit: {
      marginLeft: 'px',
      marginTop: 'px',
      scale: '',
      rotateZ: 'deg',
      opacity: '',
    },
    rules: {
      style: {
        opacity: (state: StyleType, value: StyleValueType): StyleValueType => {
          if (state.isToBeDestroyed) {
            return Math.max(value - 0.005, 0);
          } else {
            return constrain(value + state.speed.opacity, Math.min(value,0.11), 0.22);
          }
        }
      },
      transform: {
        scale: (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius*state.const.scale, 0.033),
        rotateZ: (state: StyleType, value: StyleValueType) => value + state.speed.rotateZ,
      },
      speed: {
        slow: (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005),
        general: (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5),
        rotateZ: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5),
        opacity: (state: StyleType, value: StyleValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005),
      }
    }
  };
}
