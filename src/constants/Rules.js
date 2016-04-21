import { rand, constrain,  isNotConstrained, reduceNestedState, gradualConstrain } from 'utils/reducerHelpers';
import type {StyleType, StyleValueType} from 'constants/Types';

export function frontRotaterStyleFactory(): StyleType {
  return {
    name: 'frontRotater',
    getInitialState: (): Object => {
      return {
        const: {
          minOpacity: 0.11,
          maxOpacity: 0.22,
        },
        transform: {
          scaleX: [1, ''],
          scaleY: [1, ''],
          scaleZ: [1, ''],
          rotateX: [Math.random()*360, 'deg'],
          rotateY: [Math.random()*360, 'deg'],
          rotateZ: [Math.random()*360, 'deg'],
          translateX: [0, 'px'],
          translateY: [0, 'px'],
          translateZ: [0, 'px'],
        },
        speed: {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          translateX: 0,
          translateY: 0,
          translateZ: 0,
          general: 0,
          slow: 0,
        }
      };
    },
    rules: [
      ['transform.scaleX', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033), unit]],
      ['transform.scaleY', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033), unit]],
      ['transform.scaleZ', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033), unit]],
      ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateX, -state.env.radius/5, state.env.radius/5, 0.1), unit]],
      ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateY, -state.env.radius/5, state.env.radius/5, 0.1), unit]],
      ['transform.translateZ', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateZ, -state.env.radius/5, state.env.radius/5, 0.1), unit]],
      ['transform.rotateX', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateX, unit]],
      ['transform.rotateY', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateY, unit]],
      ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateZ, unit]],
      ['speed.slow', (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005)],
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5)],
      ['speed.rotateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.rotateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.slow + rand(1000), -0.005, 0.005)],
    ]
  };
}

export function backBlinkerStyleFactory(): StyleType {
  return {
    name: 'backBlinker',
    getInitialState: (state: GlobalStateType): Object => {
      const x = rand(1) * state.env.width;
      const y = rand(1) * state.env.height;
      const scale = 1/2000 - rand(1000);
      return {
        style: {
          marginLeft: [x - 150, 'px'],
          marginTop: [y - 150, 'px'],
        },
        transform: {
          scale: [scale, ''],
          rotateZ: [0, 'deg'],
          translateZ: [0, ''],
        },
        shouldBeDestroyed: false,
        shouldSkipAfterNFramesCount: 0,
        const: {
          scale,
          x,
          y,
          minOpacity: 0.03,
          maxOpacity: 0.14
        },
        speed: {
          rotateZ: 0,
          general: 0,
          slow: 0,
        }
      };
    },
    rules: [
      ['transform.scale', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius*state.const.scale, 0.033), unit]],
      ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateZ, unit]],
      ['shouldBeDestroyed', (state: StyleType, value: StyleValueType) => isNotConstrained(state.const.x, -state.env.width/2, state.env.width/2) || isNotConstrained(state.const.y, -state.env.height/2, state.env.height/2)],
      ['shouldSkipAfterNFramesCount', (state: StyleType, value: StyleValueType) => 3],
      ['speed.slow', (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005)],
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5)],
      ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
    ]
  };
}
