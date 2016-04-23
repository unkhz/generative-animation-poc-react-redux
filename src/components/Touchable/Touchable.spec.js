import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import Touchable from './Touchable';
import {assert} from 'chai';
import {spy} from 'sinon';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

function touch(): Object {
  return {
    touches: [...arguments]
  };
}

describe('Touchable', () => {

  it('can be created without props', () => {
    const node = getNode(<Touchable />);
    assert.equal(node.nodeType, 1);
    Simulate.touchStart(node, touch({}));
    Simulate.touchMove(node, touch({}));
    Simulate.touchMove(node, touch({}));
    Simulate.touchEnd(node, touch({}));
    Simulate.touchCancel(node, touch({}));
  });

  it('has no default className', () => {
    const node = getNode(<Touchable />);
    assert.equal(node.className, '');
  });

  it('supports children', () => {
    const node = getNode(<Touchable><div className="test" /></Touchable>);
    assert.equal(node.firstChild.className, 'test');
  });

  it('calls propCallbacks on touch events', () => {
    const props = {
      onTouchStart: spy(),
      onTouchMove: spy(),
      onTouchDrag: spy(),
      onTouchEnd: spy(),
      onTouchCancel: spy(),
    };
    const node = getNode(<Touchable {...props} />);
    Simulate.touchStart(node, touch({clientX: 0, clientY: 0}));
    Simulate.touchMove(node, touch({clientX: 10, clientY: 10}));
    Simulate.touchMove(node, touch({clientX: 15, clientY: 15}));
    Simulate.touchEnd(node, touch({clientX: 10, clientY: 10}));
    Simulate.touchCancel(node, touch({clientX: 10, clientY: 10}));
    assert.isTrue(props.onTouchStart.calledOnce);
    assert.isTrue(props.onTouchMove.calledTwice);
    assert.isTrue(props.onTouchEnd.calledOnce);
    assert.isTrue(props.onTouchDrag.calledTwice);
    assert.isTrue(props.onTouchCancel.calledOnce);
  });

  it('calls onTouchDrag with delta from starting point and last drag step point', () => {
    const props = {
      onTouchDrag: spy(),
    };

    function values(delta: Object): Array {
      return [
        delta.clientX,
        delta.clientY,
        delta.deltaX,
        delta.deltaY
      ];
    }
    const node = getNode(<Touchable {...props} />);

    Simulate.touchStart(node, touch({clientX: 1, clientY: -1}));
    Simulate.touchMove(node, touch({clientX: 10, clientY: 10}));
    Simulate.touchMove(node, touch({clientX: 5, clientY: 15}));
    Simulate.touchMove(node, touch({clientX: -50, clientY: -15}));

    assert.deepEqual(values(props.onTouchDrag.getCall(0).args[1][0]),[9,11,8,12]);
    assert.deepEqual(values(props.onTouchDrag.getCall(1).args[1][0]),[4,16,-5,5]);
    assert.deepEqual(values(props.onTouchDrag.getCall(2).args[1][0]),[-51,-14,-55,-30]);
  });

});
