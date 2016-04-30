// @flow
import { decide, noise, constrain, gradualConstrain, isNotConstrained, distance, renderColorValue, randomColor, normalizeRad} from 'utils/reducerHelpers';
import React from 'react';
import type {RuleType, StyleType, StyleValueType, EnvironmentType} from 'constants/Types';

export const allowRecycling = false;

export const name = 'traveller';

export function getInitialState(env: EnvironmentType): Object {
  const x = noise(1) * env.width;
  const y = noise(1) * env.height;
  const scale = 0.03;

  const contentColor = {r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255};

  return {
    content: (
      <svg width="300" height="300" viewBox="0 0 100 100" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
        <polygon fill={renderColorValue(contentColor.r/4, contentColor.g/4, contentColor.b/4)} stroke="none" points="0 100 100 50 0 0 20 50 0 100"/>
        <polygon fill={renderColorValue(contentColor.r/2, contentColor.g/2, contentColor.b/2)} stroke="none" points="10 90 70 50 10 10 30 50 10 90"/>
        <polygon fill={renderColorValue(contentColor.r, contentColor.g, contentColor.b)} stroke="none" points="20 80 60 50 20 20 40 50 20 80"/>
      </svg>
    ),
    shouldBeDestroyed: false,
    style: {
      opacity: 0,
    },
    transform: {
      translateX: [x, 'px'],
      translateY: [y, 'px'],
      rotateZ: [0, 'rad'],
      scale: [scale, ''],
      translateZ: [0, ''],
    },
    env: {
      ...env,
    },
    const: {
      scale,
      minOpacity: 0.22,
      maxOpacity: 0.44,
    },
    pos: {
      x,
      y,
      direction: Math.random() * Math.PI * 2,
      desiredDirection: Math.random() * Math.PI * 2,
      magnitude: 0.1,
      distanceToNearestEdge: Infinity,
      panic: false,
      turningLeft: true,
    },
    velocity: {
      desiredDirection: 0,
      direction: 0,
      magnitude: 0,
      general: 0,
    }
  };
}

export const rules: RuleType[] = [
  // mutate velocity
  ['velocity.general', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(100),-0.05,0.05)],
  ['velocity.desiredDirection', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(10000),-0.05,0.05)],
  ['velocity.direction', (state: StyleType, value: StyleValueType): StyleValueType => {
    const diff = Math.abs(state.pos.direction - state.pos.desiredDirection) / 10;
    return constrain(value + ((state.velocity.general - value)*diff) + noise(100),-0.08,0.08);
  }],
  ['velocity.magnitude', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + (state.velocity.general - value)/100,-0.5,0.5)],

  // observe danger
  ['pos.distanceToNearestEdge', (state: StyleType, value: StyleValueType): StyleValueType => getDistanceToNearestEdge(state)],

  // decide panic level
  ['pos.panic', (state: StyleType, value: StyleValueType): StyleValueType => state.pos.distanceToNearestEdge < state.env.radius/6],

  // decide which way to steer
  ['pos.turningLeft', (state: StyleType, value: StyleValueType): StyleType => {
    const diff = Math.abs(state.pos.direction - state.pos.desiredDirection);
    return state.pos.distanceToNearestEdge > state.env.radius/3 && diff > Math.PI/4 && diff < Math.PI * 1.75 ? diff > Math.PI : value;
  }],

  // infer direction
  ['pos.desiredDirection', (state: StyleType, value: StyleValueType): StyleValueType => {
    if (Math.random() < 0.01) {
      const randomDirection = Math.atan2(
        noise(1) * state.env.radius - state.pos.y,
        noise(1) * state.env.radius - state.pos.x
      );
      return randomDirection;
    } else if (!state.pos.panic) {
      return normalizeRad(value + state.velocity.desiredDirection + noise(1000));
    } else {
      const directionToCenter = Math.atan2(-state.pos.y, -state.pos.x);
      return normalizeRad(directionToCenter);
    }
  }],
  ['pos.direction', (state: StyleType, value: StyleValueType): StyleValueType => {
    const diff = state.pos.panic ? Math.abs((value - state.pos.desiredDirection)/(state.pos.magnitude * 5)) : Math.abs(state.velocity.direction);
    return normalizeRad(state.pos.turningLeft ? value - diff : value + diff);
  }],

  // decide velocity
  ['pos.magnitude', (state: StyleType, value: StyleValueType): StyleValueType => {
    return gradualConstrain(value, state.velocity.magnitude + noise(100), 0.66, 3, 0.005);
  }],

  // move position
  ['pos.x', (state: StyleType, value: StyleValueType): StyleValueType => value + (Math.cos(state.pos.direction) * state.pos.magnitude)],
  ['pos.y', (state: StyleType, value: StyleValueType): StyleValueType => value + (Math.sin(state.pos.direction) * state.pos.magnitude)],

  // check if we died
  ['shouldBeDestroyed', (state: StyleType, value: StyleValueType): StyleValueType => isNotConstrained(state.pos.x, -state.env.width/2, state.env.width/2) || isNotConstrained(state.pos.y, -state.env.height/2, state.env.height/2)],

  // output to style
  ['transform.scale', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [state.const.scale, unit]],
  ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [state.pos.x, unit]],
  ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [state.pos.y, unit]],
  ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType): StyleValueType => [state.pos.direction, unit]],
];

function getDistanceToNearestEdge(state: StyleType): number {
  return Math.min(
    Math.abs(state.env.height/2 - state.pos.y),
    Math.abs(state.env.width/2 - state.pos.x),
    Math.abs(-state.env.height/2 - state.pos.y),
    Math.abs(-state.env.width/2 - state.pos.x)
  );
}
