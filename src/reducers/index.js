// @flow
import { combineReducers } from 'redux';
import PipeReducer from 'utils/PipeReducer';
import {ParticleType, ActionType, GlobalStateType} from 'constants/Types';
import {environment} from './environment';
import {layers} from './layers';
import {particles} from './particles';


function countParticles(state: GlobalStateType): GlobalStateType {
  return {
    aliveParticleCount: state.particles.filter((p: ParticleType) => !p.isToBeDestroyed).length
  };
}

export default (state: GlobalStateType, action: ActionType): GlobalStateType => {
  return new PipeReducer(state, action)
    .bind(environment)
    .bind(layers)
    .bind(particles)
    .bind(countParticles)
    .end();
};
