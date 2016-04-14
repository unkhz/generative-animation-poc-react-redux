import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ConnectedEnvironment, {Environment} from './Environment';
import {assert} from 'chai';
import {spy} from 'sinon';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

const defaultProps = {
  window,
  body: document.body,
  actions: {
    envResized: (() => undefined)
  }
};

describe('Environment', () => {

  it('can be created without props', () => {
    const node = getNode(<Environment />);
    assert.equal(node.nodeType, 1);
  });

  it('dispatches envResized on start', () => {
    const props = {
      window: {
        innerWidth: 120,
        innerHeight: 125,
        addEventListener: (() => undefined),
        removeEventListener: (() => undefined),
      },
      actions: {
        envResized: spy()
      }
    };
    const node = getNode(<Environment {...props} />);
    assert.isTrue(props.actions.envResized.calledOnce);
    assert.equal(props.actions.envResized.getCall(0).args[0], 120);
    assert.equal(props.actions.envResized.getCall(0).args[1], 125);
  });

});
