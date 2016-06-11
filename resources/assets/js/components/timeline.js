import React, { Component } from 'react';

import Chat from './chat';

export default class Timeline extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { chats } = this.props;

    const tl = chats.map((item) => <p key={item.id}>{item.message}</p>);

    return (<div>{tl}</div>);
  }
}

Timeline.propTypes = {
};
