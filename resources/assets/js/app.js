import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from 'react-router';

import Tutorials from "./tutorials";
import Register from "./register";
import Channel from "./channel";


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

  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="tutorials" component={Tutorials}></Route>
      <Route path="register" component={Register}></Route>
      <Route path="channels">
        <Route path=":projectToken/watch" component={Channel}></Route>
      </Route>
    </Route>
  </Router>

), document.getElementById('app'));
