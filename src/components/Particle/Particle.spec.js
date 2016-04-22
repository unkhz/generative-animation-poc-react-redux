import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Particle from './Particle';
import {assert} from 'chai';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

describe('Particle', () => {

  it('can be created without props', () => {
    const node = getNode(<Particle />);
    assert.equal(node.nodeType, 1);
  });

  it('has className particle', () => {
    const node = getNode(<Particle />);
    assert.equal(node.className, 'particle');
  });

  it('does not support children', () => {
    const node = getNode(<Particle><strong className="test" /></Particle>);
    assert.isNull(node.firstChild);
  });

  it('renders a child defined in props', () => {
    const props = {
      id: 1,
      content: <svg className='test-it'><path /></svg>,
    };
    const node = getNode(<Particle {...props} />);
    const svgNode = node.firstChild;
    assert.equal(svgNode.nodeName, 'svg');
    assert.equal(svgNode.firstChild.nodeName, 'path');
  });

  // @phantomjs only
  it('displays normal styles from props', () => {
    const props = {
      transform: {},
      style: {
        opacity: 1,
        marginLeft: [2, 'px'],
        width: [50, '%'],
        height: [1.5235235, 'em'],
        WebkitUserSelect: ['none', ''],
        padding: '0px 2px 5px 1px',
        invalidWithoutUnit: 0,
        invalidWithUnit: [1, 'pt'],
      }
    };
    const node = getNode(<Particle {...props} />);
    assert.equal(node.style.opacity, 1);
    assert.equal(node.style.marginLeft, '2px');
    assert.equal(node.style.width, '50%');
    assert.equal(node.style.height, '1.5235235em');
    assert.equal(node.style.WebkitUserSelect, 'none');
    assert.equal(node.style.padding, '0px 2px 5px 1px');
    assert.equal(node.style.invalidWithoutUnit, 0);
    assert.equal(node.style.invalidWithUnit, '1pt');
  });

  // @phantomjs only
  it('displays transform styles from props', () => {
    const props = {
      transform: {
        translateX: 1,
        translateY: [1.2324, 'px'],
        translateZ: [-10000000, '%'],
        rotateX: ['1', 'deg'],
        rotateY: [false, 'rad'],
        invalidWithUnit: [1, 'pt'],
        invalidWithoutUnit: 2,
      },
      style: {
      }
    };
    const node = getNode(<Particle {...props} />);
    assert.equal(node.style.transform, 'translateX(1) translateY(1.2324px) translateZ(-10000000%) rotateX(1deg) rotateY(falserad) invalidWithUnit(1pt) invalidWithoutUnit(2)');
  });

});
