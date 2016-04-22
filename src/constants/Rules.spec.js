import ReactDOM from 'react-dom';
import {assert} from 'chai';
import {frontRotaterStyleFactory, backBlinkerStyleFactory} from 'constants/Rules';
import {reduceNestedState} from 'utils/reducerHelpers';

const initialGlobalState = {
  env: {
    radius: 100,
    width: 100,
    height: 100
  }
};

[
  ['frontRotaterStyle', frontRotaterStyleFactory],
  ['backBlinkerStyle', backBlinkerStyleFactory]
].map(([styleName, styleFactory]: [string, Function]) => {
  describe(styleName, () => {

    it('can be created without props', () => {
      const style = styleFactory();
      assert.isObject(style);
    });

    it('contains initial state factory method', () => {
      const style = styleFactory();
      const state = style.getInitialState(initialGlobalState);
      assert.isObject(state.style);
      assert.isObject(state.transform);
      assert.isObject(state.speed);
    });

    it('contains rules that reduce the inital state', () => {
      const style = styleFactory();
      const initalState = style.getInitialState(initialGlobalState);
      const state = reduceNestedState(
        initalState,
        style.rules
      );
      assert.equal(Object.keys(state.style).length, Object.keys(initalState.style).length);
      assert.equal(Object.keys(state.transform).length, Object.keys(initalState.transform).length);
      assert.equal(Object.keys(state.speed).length, Object.keys(initalState.speed).length);
    });


    // @phantomjs only ( todo move to rules tests)
    it('renders an SVG inside with color', () => {
      const style = styleFactory();
      const state = style.getInitialState(initialGlobalState);
      const node = ReactDOM.render(state.content, document.createElement('div'));
      assert.match(node.firstChild.getAttribute('fill'), /rgb\([0-9.]+,[0-9.]+,[0-9.]+\)/);
    });

  });
});
