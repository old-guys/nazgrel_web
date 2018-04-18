import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from 'components/ErrorBoundary/';
import { Provider, connect } from 'react-redux';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'reducers';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const middleware = [ thunk ]
const enhancers = compose(applyMiddleware(...middleware));
const store = createStore(reducers, enhancers)

ReactDOM.render((
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
), document.getElementById('root'));
// registerServiceWorker();
