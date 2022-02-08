import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/index';

import App from './app';
import './app.css';

let MainApp = App;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MainApp/>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
