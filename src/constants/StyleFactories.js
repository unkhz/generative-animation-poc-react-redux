import { rand, constrain,  isNotConstrained, reduceNestedState, gradualConstrain, distance} from 'utils/reducerHelpers';
import type {StyleType, StyleValueType, ParticleType, ColorType} from 'constants/Types';
import React from 'react';

function renderColorValue(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function randomColor(): string {
  return renderColorValue(Math.random() * 255, Math.random() * 255, Math.random() * 255);
}

const shapes = [
  () => (
    <svg width="300" height="300" viewBox="0 0 51 48" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
      <path fill={randomColor()} stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
    </svg>
  ),
  () => (
    <svg width="300" height="300" viewBox="0 0 100 100" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
      <circle fill={randomColor()} stroke="none"  cx="50" cy="50" r="50" />
    </svg>
  ),
];

export const styleFactories = [{
  name: 'frontRotater',
  weight: 4,
  create: createFrontRotaterStyle,
}, {
  name: 'backBlinker',
  weight: 6,
  create: createBackBlinkerStyle
}];

export function decideStyle(): string  {
  return decide(styleFactories, styleFactories.map((s: StyleFactoryType) => s.weight)).name;
}

function decide(collection: array, weights: array): mixed {
  return collection[weights
    .map((weight: number) => weight * Math.random())
    .reduce((max: [number, number], weighted: number, index: number): [number, number] => {
      return weighted > max[0] ? [weighted, index] : max;
    }, [-Infinity, -1])[1]];
}

function createFrontRotaterStyle(): StyleType {
  return {
    name: 'frontRotater',
    getInitialState: (globalState: GlobalStateType): Object => {

      return {
        content: decide(shapes, [4,1])(),
        style: {

        },
        env: {
          ...globalState.env
        },
        const: {
          minOpacity: 0.11,
          maxOpacity: 0.33,
        },
        transform: {
          scale: constrain(1, 0.033, 0, globalState.env.radius/300, 0.033),
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
      ['transform.scale', (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033)],
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

function createBackBlinkerStyle(): StyleType {
  return {
    name: 'backBlinker',
    getInitialState: (globalState: GlobalStateType): Object => {
      const x = rand(1) * globalState.env.width;
      const y = rand(1) * globalState.env.height;
      const scale = 1/2000 - rand(1000);

      return {
        content: decide(shapes, [5,2])(),
        style: {},
        transform: {
          translateX: [x, 'px'],
          translateY: [y, 'px'],
          rotateZ: [0, 'deg'],
          scale: [scale, ''],
          translateZ: [0, ''],
        },
        shouldBeDestroyed: false,
        shouldSkipAfterNFramesCount: 0,
        env: {
          ...globalState,
        },
        const: {
          scale,
          x,
          y,
          minOpacity: 0.03,
          maxOpacity: 0.14,
          translateX: rand(2000),
          translateY: rand(2000),
        },
        speed: {
          translateX: 0,
          translateY: 0,
          rotateZ: 0,
          general: 0,
          slow: 0,
        }
      };
    },
    rules: [
      ['transform.scale', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius*state.const.scale, 0.033), unit]],
      ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateZ, unit]],
      ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.translateX, unit]],
      ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.translateY, unit]],
      ['shouldBeDestroyed', (state: StyleType, value: StyleValueType) => isNotConstrained(state.const.x, -state.env.width/2, state.env.width/2) || isNotConstrained(state.const.y, -state.env.height/2, state.env.height/2)],
      ['shouldSkipAfterNFramesCount', (state: StyleType, value: StyleValueType) => 3],
      ['speed.slow', (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005)],
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5)],
      ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateX', (state: StyleType, value: StyleValueType) => constrain(state.const.translateX * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],
      ['speed.translateY', (state: StyleType, value: StyleValueType) => constrain(state.const.translateY * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],

    ]
  };
}
