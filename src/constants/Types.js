export type ActionType = {type: string}
export type ThunkType = Function
export type ActionMapType = {[id: string]: ActionType|ThunkType}

export type ParticleType = {
  id: number,
  sn: number,
  isToBeDestroyed: boolean,
  env: {[id: string]: number},
  rules: RuleType[],
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

export type StyleType = {
  id: number,
  name: string,
  getInitialState: Function,
  rules: RuleType[],
}

export type StyleValueType = [number, string] | number | string;

export type RuleType = [string, Function];
