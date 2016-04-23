import { rand, constrain, normalizeRad, isNotConstrained, reduceNestedState, gradualConstrain, distance} from 'utils/reducerHelpers';
import type {StyleType, StyleValueType, ParticleType, ColorType} from 'constants/Types';
import React from 'react';

function renderColorValue(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function randomColor(r: number, g: number, b: number): string {
  return renderColorValue(r ? r : Math.random() * 255, g ? g : Math.random() * 255, b ? b : Math.random() * 255);
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
  name: 'backBlinker',
  weight: 5,
  allowRecycling: false,
  create: createBackBlinkerStyle
}, {
  name: 'traveller',
  weight: 3,
  allowRecycling: false,
  create: createTravellerStyle
}, {
  name: 'frontRotater',
  weight: 5,
  allowRecycling: false,
  create: createFrontRotaterStyle,
}];

export function decideStyle(subset: StyleFactoryType[] = styleFactories): string  {
  return (decide(subset, subset.map((s: StyleFactoryType) => s.weight)) || {}).name;
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
        content: decide(shapes, [0,4])(),
        style: {

        },
        env: {
          ...globalState.env
        },
        const: {
          minOpacity: 0.03,
          maxOpacity: 0.06,
          largeness: 0.5,
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
          z: 0,
        }
      };
    },
    rules: [
      ['transform.scale', (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033)],
      ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateX, -state.env.radius * state.const.largeness, state.env.radius * state.const.largeness, 0.1), unit]],
      ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateY, -state.env.radius * state.const.largeness, state.env.radius * state.const.largeness, 0.1), unit]],
      ['transform.translateZ', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, state.speed.translateZ, -state.env.radius * state.const.largeness, state.env.radius * state.const.largeness, 0.1), unit]],
      ['transform.rotateX', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateX, unit]],
      ['transform.rotateY', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateY, unit]],
      ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateZ, unit]],
      ['speed.z', (state: StyleType, value: StyleValueType) => constrain(value + rand(1000),-0.005,0.005)],
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5)],
      ['speed.rotateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.rotateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.z + rand(1000), -0.005, 0.005)],
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
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.5,0.5)],
      ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100), -0.5, 0.5)],
      ['speed.translateX', (state: StyleType, value: StyleValueType) => constrain(state.const.translateX * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],
      ['speed.translateY', (state: StyleType, value: StyleValueType) => constrain(state.const.translateY * distance(state.transform.translateX[0], state.transform.translateY[0], 0, 0), -5, 5)],

    ]
  };
}

function getDistanceToNearestEdge(state: ParticleType): [number, number] {
  const edgeDistances = {
    n: Math.abs(state.env.height/2 - state.pos.y),
    e: Math.abs(state.env.width/2 - state.pos.x),
    s: Math.abs(-state.env.height/2 - state.pos.y),
    w: Math.abs(-state.env.width/2 - state.pos.x),
  };

  return Object.keys(edgeDistances).reduce(([minEdge, minDist]: [string, number], edge: string) => (
    edgeDistances[edge] < minDist ? [edge, edgeDistances[edge]] : [minEdge, minDist]
  ), [undefined, Infinity]);
}

function createTravellerStyle(): StyleType {
  return {
    name: 'traveller',
    getInitialState: (globalState: GlobalStateType): Object => {
      const x = rand(1) * globalState.env.width;
      const y = rand(1) * globalState.env.height;
      const scale = 1/6000 - rand(10000);

      const contentColor = randomColor();

      return {
        content: (
          <svg width="300" height="300" viewBox="0 0 100 100" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
            <polygon fill={contentColor} stroke="none" points="0 100 100 50 0 0 20 50 0 100"/>
            <polygon opacity="0.5" fill={randomColor(contentColor.r/2, contentColor.g/2)} stroke="none" points="10 90 70 50 10 10 30 50 10 90"/>
          </svg>
        ),
        shouldBeDestroyed: false,
        style: {},
        transform: {
          translateX: [x, 'px'],
          translateY: [y, 'px'],
          rotateZ: [0, 'rad'],
          scale: [scale, ''],
          translateZ: [0, ''],
        },
        env: {
          ...globalState,
        },
        const: {
          scale,
          minOpacity: 0.44,
          maxOpacity: 0.67,
        },
        pos: {
          x,
          y,
          direction: Math.random()*(Math.PI*2),
          desiredDirection: Math.random()*(Math.PI*2),
          magnitude: 0.1,
          distanceToNearestEdge: Infinity,
          panic: false,
        },
        speed: {
          direction: 0,
          magnitude: 0,
          general: 0,
        }
      };
    },
    rules: [
      // decide speed
      ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + rand(100),-0.05,0.05)],
      ['speed.direction', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(1000),-0.05,0.05)],
      ['speed.magnitude', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + rand(100),-0.5,0.5)],

      // decide panic levels
      ['pos.distanceToNearestEdge', (state: StyleType, value: StyleValueType): StyleValueType => {
        const [nearestEdge, nearestDistance] = getDistanceToNearestEdge(state);
        return nearestDistance;
      }],
      ['pos.panic', (state: StyleType, value: StyleValueType) => state.pos.distanceToNearestEdge < 100],

      // decide direction
      ['pos.desiredDirection', (state: StyleType, value: StyleValueType): StyleValueType => {
        if (!state.pos.panic) {
          return normalizeRad(value + rand(10));
        } else {
          const directionToCenter = Math.atan2(-state.pos.y, -state.pos.x);
          return normalizeRad(directionToCenter);
        }
      }],
      ['pos.direction', (state: StyleType, value: StyleValueType): StyleValueType => {
        const diff = Math.abs((value - state.pos.desiredDirection) * state.speed.direction);
        return normalizeRad(diff < Math.PI ? value + diff : value - diff);
      }],

      // decide velocity
      ['pos.magnitude', (state: StyleType, value: StyleValueType): StyleValueType => {
        return state.pos.panic ? constrain(value + 0.01, 0, 5) : gradualConstrain(value, state.speed.magnitude + rand(100), 0.66, 3, 0.005);
      }],

      // move position
      ['pos.x', (state: StyleType, value: StyleValueType) => value + (Math.cos(state.pos.direction) * state.pos.magnitude)],
      ['pos.y', (state: StyleType, value: StyleValueType) => value + (Math.sin(state.pos.direction) * state.pos.magnitude)],

      // check if we died
      ['shouldBeDestroyed', (state: StyleType, value: StyleValueType) => isNotConstrained(state.pos.x, -state.env.width/2, state.env.width/2) || isNotConstrained(state.pos.y, -state.env.height/2, state.env.height/2)],

      // output to style
      ['transform.scale', (state: StyleType, [value, unit]: StyleValueType) => [gradualConstrain(value, 0.033, 0, state.env.radius*state.const.scale, 0.033), unit]],
      ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType) => [state.pos.x, unit]],
      ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType) => [state.pos.y, unit]],
      ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [state.pos.direction, unit]],
    ]
  };
}
