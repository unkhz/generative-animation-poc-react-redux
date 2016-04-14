// @flow
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Environment from 'containers/Environment';
import App from 'containers/App';
import Store from './store';

ReactDOM.render(
  <Provider store={ Store() }>
    <Environment window={window} body={document.body}>
      <App />
    </Environment>
  </Provider>,
  document.getElementById('root')
);
