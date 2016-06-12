import React, { Component } from 'react';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.style = {
      padding: '0 2rem 1rem 1rem',
    }
  }

  render() {

    const { style, message } = this.props;

    return (<div style={Object.assign({}, this.style, style)}>
      {message}
    </div>);
  }
}

Chat.propTypes = {
};
