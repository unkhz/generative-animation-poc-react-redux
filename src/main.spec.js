import render from './main';

describe('main', () => {
  it('renders to DOM', () => {
    const rootNode = document.createElement('div');
    render(rootNode);
    const node = rootNode.firstChild;
    assert.equal(node.nodeType, 1);
  });
});
