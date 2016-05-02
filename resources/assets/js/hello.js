var React = require('react');

var Hello = React.createClass({
  render() {
    return (
      <div className="container">Hello {this.props.name}</div>
    );
  }
});

module.exports = Hello;
