import React from "react";

const Hello = React.createClass({
  render () {
    return (
      <div>
        <div className="container">Hello {this.props.params.name}</div>
        <button className="btn btn-hello">Twbs btn!!!</button>
      </div>
    )
  }
})

export default Hello
