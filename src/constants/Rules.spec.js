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
      function getFillAttr(r: number, g: number, b: number): string {
        const node = ReactDOM.render(style.renderParticleContent({
          color: {r, g, b}
        }), document.createElement('div'));
        return node.firstChild.getAttribute('fill');
      };
      const style = styleFactory();
      const initalState = style.getInitialState(initialGlobalState);

      assert.equal(getFillAttr(12, 255, 0), 'rgb(12,255,0)');
      assert.equal(getFillAttr(12, 255, null), 'rgb(12,255,0)');
      assert.equal(getFillAttr(12, 255, -100), 'rgb(12,255,-100)');
      assert.equal(getFillAttr(12, false, 0), 'rgb(12,0,0)');
      assert.equal(getFillAttr(500, 0, 0), 'rgb(500,0,0)');
    });

  });
});
