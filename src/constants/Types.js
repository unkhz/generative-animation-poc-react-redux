export type ActionType = {type: string}
export type ThunkType = Function
export type ActionMapType = {[id: string]: ActionType|ThunkType}

export type ParticleCollectionType = {
  aliveParticleCount: number,
  isPaused: boolean,
  env: {[id: string]: number},
  particles: ParticleType[],
}

export type ParticleType = {
  id: number,
  sn: number,
  isToBeDestroyed: boolean,
  style: {[id: string]: number},
  env: {[id: string]: number},
  transform: {[id: string]: number},
  speed: {[id: string]: number},
  unit: {[id: string]: string},
  moveRules: {[id: string]: Function | object},
}

export type LayerType = {
  id: number,
  sn: number,
  frameRequestId: number,
  color: ColorType,
}

export type ColorType = {
  r: number,
  g: number,
  b: number
}

export type RulesType = {[id: string]: Function | RulesType}

export type GlobalStateType = {
  env: EnvironmentType,
  isPaused: boolean,
  aliveParticleCount: number,
  layers: LayerType[],
  particles: ParticleType[]
}

export type EnvironmentType = {
  radius: number
}
