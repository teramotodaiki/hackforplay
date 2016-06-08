import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import * as reducers from './reducers/';
import Tutorials from "./tutorials";
import Register from "./register";
import Channel from "./channel";

const store = createStore(combineReducers(reducers));

const App = React.createClass({

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }

});

render((

  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="tutorials" component={Tutorials}></Route>
        <Route path="register" component={Register}></Route>
        <Route path="channels">
          <Route path=":id/watch" component={Channel}></Route>
        </Route>
      </Route>
    </Router>
  </Provider>

), document.getElementById('app'));
