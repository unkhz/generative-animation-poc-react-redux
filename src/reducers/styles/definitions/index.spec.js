import ReactDOM from 'react-dom';
import {assert} from 'chai';
import {styleDefinitions, decideStyle} from 'reducers/styles/definitions';
import {reduceNestedState} from 'utils/reducerHelpers';

const initialGlobalState = {
  env: {
    radius: 100,
    width: 100,
    height: 100
  }
};

styleDefinitions.map((style: StyleDefinitionType ) => {
  describe(name, () => {

    it('implements StyleDefinition interface', () => {
      assert.isObject(style);
      assert.isString(style.name);
      assert.isBoolean(style.allowRecycling);
      assert.isFunction(style.getInitialState);
      assert.isArray(style.rules);
    });

    it('contains initial state factory method which returns globally acceptable state', () => {
      const state = style.getInitialState(initialGlobalState);
      assert.isDefined(state.content);
      assert.isObject(state.style);
      assert.isObject(state.transform);
    });

    it('contains rules that reduce the inital state', () => {
      const initialState = style.getInitialState(initialGlobalState);
      const state = reduceNestedState(initialState, style.rules);
      assert.equal(Object.keys(state.style).length, Object.keys(initialState.style).length);
      assert.equal(Object.keys(state.transform).length, Object.keys(initialState.transform).length);
      initialState.const && assert.equal(Object.keys(state.const).length, Object.keys(initialState.const).length);
      initialState.velocity && assert.equal(Object.keys(state.velocity).length, Object.keys(initialState.velocity).length);
    });

    it('renders content inside', () => {
      const state = style.getInitialState(initialGlobalState);
      const node = ReactDOM.render(state.content, document.createElement('div'));
      assert.equal(node.nodeName, 'svg');
    });

  });
});

describe('decideStyle', () => {
  it('returns undefined when filter finds nothing', () => {
    const style = decideStyle((s: StyleDefinitionType) => false);
    assert.isUndefined(style);
  });

  it('returns a style name when filter is not defined', () => {
    const style = decideStyle();
    assert.isString(style);
  });
});
