import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import Help from 'components/Help';
import {assert} from 'chai';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

describe('Help', () => {

  it('contains help without particle count', () => {
    const props = {
      aliveParticleCount: 0
    };
    const node = getNode(<Help {...props} />);
    assert.equal(node.className, 'help');
    assert.equal(node.getAttribute('data-count'), 0);
  });

  it('contains help with particle count', () => {
    const props = {
      aliveParticleCount: 2,
    };
    const node = getNode(<Help {...props} />);
    assert.equal(node.className, 'help');
    assert.equal(node.getAttribute('data-count'), 2);
  });

});
