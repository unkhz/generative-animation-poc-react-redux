// @flow
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Environment from 'containers/Environment';
import App from 'containers/App';
import Store from './store';

export default function render(rootNode: Node) {
  ReactDOM.render(
    <Provider store={ Store() }>
      <Environment window={window} body={document.body}>
        <App />
      </Environment>
    </Provider>,
    rootNode
  );
}

// auto-render in template.html
(function(document: Document){
  const rootNode = document.getElementById('root');
  if (rootNode) {
    render(rootNode);
  }
})(document);
