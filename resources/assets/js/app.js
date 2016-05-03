import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from 'react-router';

import Hello from "./hello";
import Tutorials from "./tutorials";

import Tether from 'tether';
import jQuery from "jquery";
import "module";

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
      <Route path="hello/:name" component={Hello}></Route>
    </Route>
  </Router>

), document.getElementById('app'));
