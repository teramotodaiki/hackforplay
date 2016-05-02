import React from "react";

const Hello = React.createClass({
  render () {
    return (
      <div className="container">Hello {this.props.params.name}</div>
    )
  }
})

export default Hello
