// @flow
import topologicalSort from 'topsort';

type ExportKeyType = string;
type ImportKeyType = string;
type ReducerGraphEdgeType = [ImportKeyType, ExportKeyType];

export type ReducerType = {
  reducer: Function,
  exportedKeys: ExportKeyType[],
  importedKeys: ImportKeyType[],
};

export type ReducerGraphType = {
  reducers: Function[],
  idsByExportKeys: {[id: ExportKeyType]: number},
  dependencies: ReducerGraphEdgeType[],
};

export function createReducerGraph(): ReducerGraphType {
  return {
    reducers: [],
    idsByExportKeys: {},
    dependencies: []
  };
}

export function registerReducer(graph: ReducerGraphType, {reducer, exportedKeys, importedKeys = []}: ReducerType): ReducerGraphType {
  if (!graph) {
    graph = createReducerGraph();
  }

  graph.reducers.push(reducer);
  const id = graph.reducers.length - 1;

  exportedKeys.forEach((exportedKey: ExportKeyType) => {
    graph.idsByExportKeys[exportedKey] = id;
  });

  importedKeys.forEach((importedKey: ImportKeyType) => {
    exportedKeys.forEach((exportedKey: ExportKeyType) => {
      graph.dependencies.push([importedKey, exportedKey]);
    });
  });

  return graph;
}

export function getReducers(graph: ReducerGraphType): Function[] {
  return topologicalSort(graph.dependencies.map(mapKeysToReducerIds.bind(null, graph)))
    .map((id: number): Function => graph.reducers[id]);
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
