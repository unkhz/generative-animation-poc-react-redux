import {createReducerGraph, registerReducer, getReducers} from 'utils/reducerGraph';
import type {ReducerGraphType, ReducerDefinitionType} from 'utils/reducerGraph';
import {spy} from 'sinon';

type KeyListType = string[];

function createFakeReducer(exportedKey: string, importedKeys: KeyListType): ReducerDefinitionType {
  const reducer = spy();
  reducer.__exportedKey = exportedKey;
  return {
    reducer,
    exportedKey,
    importedKeys,
  };
}

function getOrder(graph: ReducerGraphType): string[] {
  return exportedKeysOfSortedGraph;
}

describe('digraphReducer', () => {

  it('creates a directed graph', () => {
    let graph = createReducerGraph();
    let a, b, c, d;
    registerReducer(graph, a = createFakeReducer('a', []));
    registerReducer(graph, b = createFakeReducer('b', ['a']));
    registerReducer(graph, c = createFakeReducer('c', ['b', 'd']));
    registerReducer(graph, d = createFakeReducer('d', ['a', 'b']));

    assert.deepEqual(graph.reducerDefinitions, [a, b, c, d],
      'reducers are in order of registering');
    assert.deepEqual(graph.idsByExportKeys, {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
    });
    assert.deepEqual(JSON.stringify(graph.dependencies), JSON.stringify([
      ['a', 'b'],
      ['b', 'c'],
      ['d', 'c'],
      ['a', 'd'],
      ['b', 'd'],
    ]));
  });

  it('sorts dependency graph topologically', () => {
    let graph = createReducerGraph();
    registerReducer(graph, createFakeReducer('a', []));
    registerReducer(graph, createFakeReducer('b', ['a']));
    registerReducer(graph, createFakeReducer('c', ['b', 'd']));
    registerReducer(graph, createFakeReducer('d', ['a', 'b']));
    registerReducer(graph, createFakeReducer('e', ['d']));
    registerReducer(graph, createFakeReducer('f', ['d']));
    registerReducer(graph, createFakeReducer('g', ['e']));
    registerReducer(graph, createFakeReducer('h', ['f']));

    const sortedGraph = getReducers(graph)
      .map((def: ReducerDefinitionType): string[] => def.exportedKey);

    assert.equal(
      JSON.stringify(sortedGraph),
      JSON.stringify(['a', 'b', 'd', 'c', 'e', 'f', 'g', 'h'])
    );
  });

  it('throws an error if dependency graph has circular references', () => {
    let graph = createReducerGraph();
    registerReducer(graph, createFakeReducer('a', ['b']));
    registerReducer(graph, createFakeReducer('b', ['a']));

    assert.throws((): any => getReducers(graph));
  });

  it('throws an error if dependency graph has unexported references', () => {
    let graph = createReducerGraph();
    registerReducer(graph, createFakeReducer('a', ['b']));
    registerReducer(graph, createFakeReducer('b', ['MISSING']));

    assert.throws((): any => getReducers(graph));
  });

});
