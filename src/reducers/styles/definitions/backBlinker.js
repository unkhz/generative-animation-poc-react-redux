// @flow
import {decide, noise, constrain, gradualConstrain, isNotConstrained, distance, renderColorValue, randomColor} from 'utils/reducerHelpers';
import {StyleType, StyleValueType, EnvironmentType} from 'constants/Types';
import React from 'react';

export const allowRecycling = true;

export const name: string = 'backBlinker';

export function getInitialState(env: EnvironmentType): StyleType {
  const x = noise(1) * env.width;
  const y = noise(1) * env.height;
  const scale = 1/2000 - noise(1000);

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
      ...env,
    },
    const: {
      scale,
      x,
      y,
      minOpacity: 0.22,
      maxOpacity: 0.33,
      translateX: noise(2000),
      translateY: noise(2000),
    },
    velocity: {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      general: 0,
    }
  };
}

export const rules = [
  ['transform.scale', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [gradualConstrain(value, 0.033, 0, state.env.radius*state.const.scale, 0.033), unit]],
  ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.rotateZ, unit]],
  ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.translateX, unit]],
  ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.translateY, unit]],
  ['shouldBeDestroyed', (state: StyleType, value: StyleValueType): StyleValueType => isNotConstrained(state.const.x, -state.env.width/2, state.env.width/2) || isNotConstrained(state.const.y, -state.env.height/2, state.env.height/2)],
  ['shouldSkipAfterNFramesCount', (state: StyleType, value: StyleValueType): StyleValueType => 3],
  ['velocity.general', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(100),-0.5,0.5)],
  ['velocity.rotateZ', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.translateX', (state: StyleType, value: StyleValueType): StyleValueType => constrain(state.const.translateX * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],
  ['velocity.translateY', (state: StyleType, value: StyleValueType): StyleValueType => constrain(state.const.translateY * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],
];

const shapes = [
  (): React.Element => (
    <svg width="300" height="300" viewBox="0 0 51 48" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
      <path fill={randomColor()} stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
    </svg>
  ),
  (): React.Element => (
    <svg width="300" height="300" viewBox="0 0 100 100" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
      <circle fill={randomColor()} stroke="none"  cx="50" cy="50" r="50" />
    </svg>
  ),
];
