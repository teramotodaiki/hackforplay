import React, { Component } from 'react';

const URL_REGEX = /(https?:\/\/\S*)/g;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.style = {
      padding: '0 2rem 1rem 1rem',
    }
  }

  render() {

    const { style, message } = this.props;
    const body = message
      .split(URL_REGEX).map((item, i) =>
        URL_REGEX.test(item) ? <a key={i} href={item} target="_blank">{item}</a> : item);

    return (<div style={Object.assign({}, this.style, style)}>
      {body}
    </div>);
  }
}

Chat.propTypes = {
};
