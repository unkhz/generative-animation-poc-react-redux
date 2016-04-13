import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Layer from './Layer';
import {assert} from 'chai';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

// @phantomjs only
describe('Layer', () => {
  it('can be created without props', () => {
    const node = getNode(<Layer />);
    assert.equal(node.nodeType, 1);
  });

  it('renders no children without particles', () => {
    const node = getNode(<Layer />);
    assert.equal(node.children.length, 0);
  });

  it('has className layer', () => {
    const node = getNode(<Layer />);
    assert.equal(node.className, 'layer');
  });

  it('does not support children', () => {
    const node = getNode(<Layer><div className="test" /></Layer>);
    assert.equal(node.children.length, 0);
  });

  it('renders child Particle', () => {
    const props = {
      particles: [{id: 1}]
    };
    const node = getNode(<Layer {...props} />);
    assert.equal(node.children.length, 1);
    assert.equal(node.firstChild.className, 'particle');
  });

  it('renders multiple child Particles', () => {
    const props = {
      particles: [{id: 1}, {id: 2}],
    };
    const node = getNode(<Layer {...props} />);
    assert.equal(node.children.length, 2);
  });

  it('renders an SVG inside the child particle', () => {
    const props = {
      particles: [{id: 1}],
    };
    const node = getNode(<Layer {...props} />);
    const svgNode = node.firstChild.firstChild;
    assert.equal(svgNode.nodeName, 'svg');
    assert.equal(svgNode.firstChild.nodeName, 'path');
  });

  // @phantomjs only
  it('renders an SVG inside the child particle with color', () => {
    function getFillAttr(r: number, g: number, b: number): Node {
      const props = {
        particles: [{id: 1}],
        color: {r,g,b}
      };
      const node = getNode(<Layer {...props} />);
      return node.firstChild.firstChild.firstChild.getAttribute('fill');
    };
    assert.equal(getFillAttr(12, 255, 0), 'rgb(12,255,0)');
    assert.equal(getFillAttr(12, 255, null), 'rgb(12,255,0)');
    assert.equal(getFillAttr(12, 255, -100), 'rgb(12,255,-100)');
    assert.equal(getFillAttr(12, false, 0), 'rgb(12,0,0)');
    assert.equal(getFillAttr(500, 0, 0), 'rgb(500,0,0)');
  });
});
