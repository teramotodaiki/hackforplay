import React, { Component } from 'react';

export default class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.style = {
      position: 'absolute',
      bottom: 0,
    };
  }

  render() {
    const { style } = this.props;

    return (<div style={Object.assign({}, this.style, style)}>
      <input type="text"></input>
    </div>);
  }
}

ActionBar.propTypes = {
};
