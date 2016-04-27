// @flow
import { noise, constrain, reduceNestedState, initPartialState } from 'utils/reducerHelpers';
import * as actionTypes from 'constants/ActionTypes';
import {merge} from 'lodash';
import {RuleType, ParticleType, ActionType, StyleType, StyleValueType, EnvironmentType} from 'constants/Types';

let particleId = 0;
export function createParticle(style: StyleType, env: EnvironmentType): ParticleType {
  return {
    ...merge({
      style: {
        opacity: 0,
      },
      const: {
        minOpacity: 0.11,
        maxOpacity: 0.22,
      },
      speed: {
        particle: 0,
        opacity: 0,
      },
      shouldSkipAfterNFramesCount: 0,
    }, style.getInitialState(env)),

    id: particleId++,
    sn: 0,
    isToBeDestroyed: false,
    styleName: style.name,
    rules: [
      ...style.rules,
      ['sn', (state: StyleType, value: StyleValueType): StyleValueType => value+1],
      ['isToBeDestroyed', (state: StyleType, value: StyleValueType): StyleValueType => !!state.isToBeDestroyed || !!state.shouldBeDestroyed],
      ['speed.particle', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + noise(1000),-0.005,0.005)],
      ['speed.opacity', (state: StyleType, value: StyleValueType): StyleValueType => constrain(value + state.speed.particle + noise(1000), -0.005, 0.005)],
      ['style.opacity', (state: StyleType, value: StyleValueType): StyleValueType => {
        if (state.isToBeDestroyed) {
          return Math.max(value - 0.005, 0);
        } else {
          return constrain(
            value + state.speed.opacity,
            Math.min(value, state.const.minOpacity || 0.11),
            state.const.maxOpacity || 0.22
          );
        }
      }]
    ],
  };
}


export const reducer = particles;
export const exportedKey: string = 'particles';
export const importedKeys: string[] = ['env', 'styles'];


const initialState = [];

export function particles(state: ParticleType[] = initialState, action: ActionType, dependencies: [EnvironmentType, StyleType[]]): ParticleType[] {
  switch (action.type) {

    case actionTypes.MOVE_PARTICLE:
      return moveParticle(state, action, dependencies);

    case actionTypes.ADD_PARTICLE:
      return addParticle(state, action, dependencies);

    case actionTypes.DELETE_PARTICLE:
      return deleteParticle(state, action, dependencies);

    case actionTypes.DELETE_SOME_PARTICLES:
      return deleteSomeParticles(state, action, dependencies);

    default:
      return state;
  }
}

function moveParticle(state: ParticleType, action: ActionType, [env, styles]: [EnvironmentType, StyleType[]]): ParticleType {
  let newState;
  if (!env.isMovementPaused) {
    newState = state.map((particle: ParticleType): ParticleType => {
      if (particle.shouldSkipAfterNFramesCount > 0) {
        return {
          ...particle,
          shouldSkipAfterNFramesCount: particle.shouldSkipAfterNFramesCount-1,
        };
      }
      return reduceNestedState({
        ...particle,
        env: env || particle.env,
      }, particle.rules);
    });
  } else {
    newState = state;
  }

  return newState.filter((particle: ParticleType): ParticleType => !particle.isToBeDestroyed || particle.style.opacity > 0);
}

function addParticle(state: ParticleType, action: ActionType, [env, styles]: [EnvironmentType, StyleType[]]): ParticleType {
  return [
    ...state,
    // $FlowFixMe: Can't cope with Array.apply
    ...Array.apply(null, {length: action.count}).map((): ParticleType  => {
      return createParticle(getStyle(styles, action.styleName), env);
    })
  ];
}

function deleteParticle(state: ParticleType, action: ActionType): ParticleType {
  return state.map((particle: ParticleType): ParticleType => {
    if (particle.id === action.id) {
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
}

function deleteSomeParticles(state: ParticleType, action: ActionType): ParticleType {
  let count = action.count;
  return state.map((particle: ParticleType): ParticleType => {
    if (!particle.isToBeDestroyed && count > 0) {
      count--;
      particle.isToBeDestroyed = true;
    }
    return particle;
  });
}


function getStyle(styles: StyleType[], name: string): StyleType {
  const [style] = styles.filter((style: StyleType): StyleType => {
    return style.name === name;
  });

  if (!style) {
    throw new Error(`Invalid style ${name}`);
  }
  return style;
}
