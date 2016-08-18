import React, { Component } from 'react';

const URL_REGEX = /(https?:\/\/\S*)/g;

export default class Chat extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { style, chat } = this.props;
    const body = chat.message
      .split(URL_REGEX).map((item, i) =>
        URL_REGEX.test(item) ? <a key={i} href={item} target="_blank">{item}</a> : item);

    return (<div style={style}>
      {body}
    </div>);
  }
}

Chat.propTypes = {
};
