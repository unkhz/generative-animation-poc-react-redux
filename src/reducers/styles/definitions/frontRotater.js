// @flow
import { decide, noise, constrain, gradualConstrain, renderColorValue, randomColor} from 'utils/reducerHelpers';
import React from 'react';
import type {RuleType, StyleType, StyleValueType, EnvironmentType} from 'constants/Types';

export const allowRecycling = true;

export const name: string = 'frontRotater';

export function getInitialState(env: EnvironmentType): StyleType {
  return {
    content: decide(shapes, [0,1])(),
    style: {

    },
    env: {
      ...env
    },
    const: {
      minOpacity: 0.03,
      maxOpacity: 0.06,
      largeness: 0.5,
    },
    transform: {
      scale: constrain(1, 0.033, 0, env.radius/300, 0.033),
      rotateX: [Math.random() * 360, 'deg'],
      rotateY: [Math.random() * 360, 'deg'],
      rotateZ: [Math.random() * 360, 'deg'],
      translateX: [0, 'px'],
      translateY: [0, 'px'],
      translateZ: [0, 'px'],
    },
    velocity: {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      general: 0,
      z: 0,
    }
  };
}

export const rules = [
  ['transform.scale', (state: StyleType, value: StyleValueType): StyleValueType => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033)],
  ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => (
    [gradualConstrain(
      value,
      state.velocity.translateX, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => (
    [gradualConstrain(
      value,
      state.velocity.translateY, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.translateZ', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => (
    [gradualConstrain(
      value,
      state.velocity.translateZ, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.rotateX', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.rotateX, unit]],
  ['transform.rotateY', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.rotateY, unit]],
  ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [value + state.velocity.rotateZ, unit]],
  ['velocity.z', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(1000),-0.005,0.005)],
  ['velocity.general', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(100),-0.5,0.5)],
  ['velocity.rotateX', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.rotateY', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.rotateZ', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.translateX', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.translateY', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.general + noise(100), -0.5, 0.5)],
  ['velocity.translateZ', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.velocity.z + noise(1000), -0.005, 0.005)],
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
