// @flow
import {decide} from 'utils/reducerHelpers';
import * as frontRotater from './frontRotater';
import * as backBlinker from './backBlinker';
import * as traveller from './traveller';
import type {StyleDefinitionType} from 'constants/Types';

export const styleDefinitions = [
  backBlinker,
  traveller,
  frontRotater,
];

const weights = {
  backBlinker: 50,
  traveller: 38,
  frontRotater: 50,
};

export function decideStyle(filter: Function, collection: StyleDefinitionType[] = styleDefinitions): string  {
  const filtered = filter ? collection.filter(filter) : styleDefinitions;
  return (decide(filtered, filtered.map((s: StyleDefinitionType): number => weights[s.name])) || {}).name;
}
