import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Particle from './Particle';
import {assert} from 'chai';

function getNode(props: Object): Node {
  // Render a checkbox with label in the document
  const node = TestUtils.renderIntoDocument(
    <Particle {...props}  />
  );
  return ReactDOM.findDOMNode(node);
}

// @phantomjs only
describe('Particle', () => {
  it('displays normal styles from props', () => {
    const props = {
      transform: {},
      style: {
        opacity: 1,
        marginLeft: 2,
        width: 50,
        height: 1.5235235,
        WebkitUserSelect: 'none',
        padding: '0px 2px 5px 1px',
        invalidWithoutUnit: 0,
        invalidWithUnit: 1,
      },
      unit: {
        opacity: '',
        marginLeft: 'px',
        width: '%',
        height: 'em',
        WebkitUserSelect: '',
        invalidWithUnit: 'pt'
      }
    };
    const node = getNode(props);
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
        translateY: 1.2324,
        translateZ: -10000000,
        rotateX: '1',
        rotateY: false,
        invalidWithUnit: 1,
        invalidWithoutUnit: 2,
      },
      style: {
      },
      unit: {
        translateX: '',
        translateY: 'px',
        translateZ: '%',
        rotateX: 'deg',
        rotateY: 'rad',
        invalidWithUnit: 'pt'
      }
    };
    const node = getNode(props);
    assert.equal(node.style.transform, 'translateX(1) translateY(1.2324px) translateZ(-10000000%) rotateX(1deg) rotateY(falserad) invalidWithUnit(1pt) invalidWithoutUnit(2)');
  });
});
