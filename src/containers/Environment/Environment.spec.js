import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ConnectedEnvironment, {Environment} from 'containers/Environment';
import {Provider} from 'react-redux';
import {createWithMiddleware} from 'store';
import {assert} from 'chai';
import {spy} from 'sinon';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

function touchData(): Object {
  return {
    touches: [...arguments]
  };
}

function fakeEvent(type: string, data: Object): Object {
  const evt = new Event(type);
  return {
    ...evt,
    stopImmediatePropagation: (): undefined => undefined,
    stopPropagation: (): undefined => undefined,
    preventDefault: (): undefined => undefined,
    ...data
  };
}

const defaultProps = {
  window,
  body: document.body,
  actions: {
    envResized: ((): undefined => undefined)
  }
};

describe('Environment', () => {

  it('can be created without props', () => {
    const node = getNode(<Environment />);
    assert.equal(node.nodeType, 1);
  });

  it('connects to store', () => {
    function reducer(): Object {
      return {};
    }
    const store = createWithMiddleware(reducer, {});
    const node = getNode(
      <Provider store={store}>
        <ConnectedEnvironment />
      </Provider>
    );
    assert.equal(node.nodeType, 1);
  });

  it('dispatches envResized on start', () => {
    const props = {
      window: {
        innerWidth: 120,
        innerHeight: 125,
        addEventListener: ((): undefined => undefined),
        removeEventListener: ((): undefined => undefined),
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

  it('dispatches envResized on window resize', () => {
    let windowResizeCallback;
    const props = {
      window: {
        innerWidth: 120,
        innerHeight: 125,
        addEventListener: (evt: string, callback: Function) => {
          windowResizeCallback = callback;
        },
        removeEventListener: ((): undefined => undefined),
      },
      actions: {
        envResized: spy()
      }
    };
    const node = getNode(<Environment {...props} />);
    props.window.innerWidth = 111;
    props.window.innerHeight = 211;
    windowResizeCallback();
    assert.isTrue(props.actions.envResized.calledTwice);
    assert.equal(props.actions.envResized.getCall(1).args[0], 111);
    assert.equal(props.actions.envResized.getCall(1).args[1], 211);
  });

  it('dispatches addParticle or deleteSomeParticles on wheel event', () => {
    let eventListeners = {};
    const props = {
      body: {
        addEventListener: (evt: string, callback: Function) => {
          eventListeners[evt] = callback;
        }
      },
      actions: {
        envResized: spy(),
        addParticle: spy(),
        deleteSomeParticles: spy(),
      }
    };
    const node = getNode(<Environment {...props} />);

    eventListeners.wheel(fakeEvent('wheel', {deltaY: 10}));
    assert.isTrue(props.actions.addParticle.calledOnce);
    eventListeners.wheel(fakeEvent('wheel', {deltaY: -10}));
    assert.isTrue(props.actions.deleteSomeParticles.calledOnce);
  });

  it('dispatches pause on space keypress event', () => {
    let eventListeners = {};
    const props = {
      body: {
        addEventListener: (evt: string, callback: Function) => {
          eventListeners[evt] = callback;
        }
      },
      actions: {
        envResized: spy(),
        toggleAnimation: spy(),
      }
    };
    const node = getNode(<Environment {...props} />);

    eventListeners.keyup(fakeEvent('keyup', {keyCode: 32}));
    assert.isTrue(props.actions.toggleAnimation.calledOnce);
    eventListeners.keyup(fakeEvent('keyup', {deltaY: 33}));
    assert.isTrue(props.actions.toggleAnimation.calledOnce);
  });

  it('dispatches addParticle or deleteSomeParticles on touchDrag event', () => {
    const props = {
      actions: {
        envResized: spy(),
        addParticle: spy(),
        deleteSomeParticles: spy(),
      }
    };
    const node = getNode(<Environment {...props} />);

    Simulate.touchStart(node, touchData({clientY: 0}));
    Simulate.touchMove(node, touchData({clientY: 10}));
    assert.isTrue(props.actions.addParticle.calledOnce);

    Simulate.touchStart(node, touchData({clientY: 0}));
    Simulate.touchMove(node, touchData({clientY: -10}));
    assert.isTrue(props.actions.deleteSomeParticles.calledOnce);
  });

});
