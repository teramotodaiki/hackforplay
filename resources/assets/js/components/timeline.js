import React, { Component } from 'react';

import Chat from './chat';

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.style = {
      overflow: 'scroll',
    };
  }

  render() {

    const { chats, style } = this.props;

    const tl = chats.map((item) => <p key={item.id}>{item.message}</p>);

    return (<div style={Object.assign({}, this.style, style)}>
      {tl}
    </div>);
  }
}

Timeline.propTypes = {
};
