import React from "react"
import { render } from "react-dom"
import { Router, Route, Link, browserHistory } from 'react-router'

import Hello from "./hello"

const App = React.createClass({

  render() {
    return (
      <div>
        <h1>This is Hello app!</h1>
        {this.props.children}
      </div>
    )
  }

});

render((

  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="hello/:name" component={Hello}></Route>
    </Route>
  </Router>

), document.getElementById('app'))
