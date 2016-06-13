import React, { Component } from 'react';

import Chat from './chat';

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.style = {
      overflow: 'scroll',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    };

    this.state = { isAutoScroll: true };

  }

  componentDidMount() {
    this.refs.container.addEventListener('scroll', ({ target }) => {
      const scrollFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
      this.setState({ isAutoScroll: scrollFromBottom <= 0 });
    });
  }

  componentDidUpdate() {
    if (this.state.isAutoScroll) {
      this.refs.container.scrollTop = this.refs.container.scrollHeight;
    }
  }

  render() {
    const { chats, style } = this.props;

    const tl = chats.map((item) => <Chat key={item.id} {...item}></Chat>);

    return (<div ref="container" style={Object.assign({}, this.style, style)}>
      {tl}
    </div>);
  }
}

Timeline.propTypes = {
};