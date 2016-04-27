// @flow
import topologicalSort from 'topsort';

type ExportKeyType = string;
type ImportKeyType = string;
type ReducerGraphEdgeType = [ImportKeyType, ExportKeyType];

export type ReducerDefinitionType = {
  reducer: Function,
  exportedKey: ExportKeyType,
  importedKeys: ImportKeyType[],
};

export type ReducerGraphType = {
  reducerDefinitions: ReducerDefinitionType[],
  idsByExportKeys: {[id: ExportKeyType]: number},
  dependencies: ReducerGraphEdgeType[],
};

export function createReducerGraph(): ReducerGraphType {
  return {
    reducerDefinitions: [],
    idsByExportKeys: {},
    dependencies: []
  };
}

export function registerReducer(graph: ReducerGraphType, reducerDefinition: ReducerDefinitionType): ReducerGraphType {
  if (!graph) {
    graph = createReducerGraph();
  }

  const {reducer, exportedKey, importedKeys = []} = reducerDefinition;

  graph.reducerDefinitions.push(reducerDefinition);

  const id = graph.reducerDefinitions.length - 1;

  graph.idsByExportKeys[exportedKey] = id;
  importedKeys.forEach((importedKey: ImportKeyType) => {
    graph.dependencies.push([importedKey, exportedKey]);
  });

  return graph;
}

export function getReducers(graph: ReducerGraphType): ReducerDefinitionType[] {
  const sortedIds = topologicalSort(graph.dependencies.map(mapKeysToReducerIds.bind(null, graph)));

  return sortedIds
    .map((id: number): ReducerDefinitionType => graph.reducerDefinitions[id])
    // add missing
    .concat(graph.reducerDefinitions.filter((def: ReducerDefinitionType, id: number): boolean => sortedIds.indexOf(id) === -1));
}

function mapKeysToReducerIds(graph: ReducerGraphType, [a, b]: ReducerGraphEdgeType): [number, number] {
  return [findReducer(graph,a), findReducer(graph,b)];
}

function findReducer(graph: ReducerGraphType, exportKey: ExportKeyType): number {
  const reducerId = graph.idsByExportKeys[exportKey];
  if (reducerId === undefined) {
    throw new Error('Unmet reducer dependency. No reducer has defined exportKey ' + JSON.stringify(exportKey));
  }
  return reducerId;
}
