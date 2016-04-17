import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ConnectedApp, {App} from './App';
import {assert} from 'chai';
import {spy} from 'sinon';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

function getLayerNodes(node: Node): Array {
  return Array.prototype.slice.call(node.children)
    .filter((n: Node) => n.className === 'layer');
}

describe('App', () => {

  it('can be created without props', () => {
    const node = getNode(<App />);
    assert.equal(node.nodeType, 1);
  });

  it('dispatches requestParticleMove on start', () => {
    const props = {
      actions: {
        requestParticleMove: spy()
      }
    };
    const node = getNode(<App {...props} />);
    assert.isTrue(props.actions.requestParticleMove.calledOnce);
  });

  it('contains help with particle count', () => {
    const props = {
      aliveParticleCount: 2,
      particles: [{
        id: 0,
      },{
        id: 1,
      }]
    };
    const node = getNode(<App {...props} />);
    assert.equal(node.firstChild.className, 'layer help');
    assert.equal(node.firstChild.getAttribute('data-count'), 2);
  });

  it('contains layers from props', () => {
    const props = {
      layers: [
        {id: 0},
        {id: 1},
      ]
    };
    const node = getNode(<App {...props} />);
    const layerNodes = getLayerNodes(node);
    assert.equal(layerNodes.length, 2);
  });

  it('contains layers containing particles containing svg from props', () => {
    const props = {
      layers: [{
        id: 0,
        color: {r: 1, g: 2, b: 4},
      },{
        id: 1,
        color: {r: 3, g: 44, b: 42},
      }],
      particles: [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3},
      ]
    };
    const node = getNode(<App {...props} />);
    const layerNodes = getLayerNodes(node);
    assert.equal(layerNodes.length, 2);
    assert.equal(layerNodes[0].children[0].firstChild.firstChild.getAttribute('fill'), 'rgb(1,2,4)');
    assert.equal(layerNodes[0].children[1].firstChild.firstChild.getAttribute('fill'), 'rgb(1,2,4)');
    assert.equal(layerNodes[1].children[0].firstChild.firstChild.getAttribute('fill'), 'rgb(3,44,42)');
    assert.equal(layerNodes[1].children[1].firstChild.firstChild.getAttribute('fill'), 'rgb(3,44,42)');
  });

  it('contains layers containing evenly separated particles from props', () => {
    const props = {
      layers: [
        {id: 0},
        {id: 1},
        {id: 2},
      ],
      particles: [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
      ]
    };
    const node = getNode(<App {...props} />);
    const layerNodes = getLayerNodes(node);
    assert.equal(layerNodes.length, 3, 'layers count');
    assert.equal(layerNodes[0].children.length, 3, 'first layer particle count');
    assert.equal(layerNodes[1].children.length, 3, 'second layer particle count');
    assert.equal(layerNodes[2].children.length, 2, 'third layer particle count');
  });
});
