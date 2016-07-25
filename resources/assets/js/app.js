import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';

import * as reducers from './reducers/';
import Tutorials from "./tutorials";
import Register from "./register";
import Channel from "./channel";
import Qcard from './qcard';
import ChannelList from './channel-list';
import ChannelCreate from './channel-create';
import BellCreate from './bell-create';
import News from './news';

import Main from './Main';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunkMiddleware)
);


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
      <Route path="tutorials" component={Tutorials}></Route>
      <Route path="/" component={Main}>
        <Route path="register" component={Register}></Route>
        <Route path="channels">
          <Route path=":id/watch" component={Channel}></Route>
          <Route path="list" component={ChannelList}></Route>
          <Route path="create" component={ChannelCreate}></Route>
        </Route>
        <Route path="qcards">
          <Route path=":id/edit" component={Qcard}></Route>
        </Route>
        <Route path="bells">
          <Route path="create" component={BellCreate}></Route>
        </Route>
        <Route path="news" component={News}></Route>
      </Route>
    </Router>
  </Provider>

), document.getElementById('app'));
