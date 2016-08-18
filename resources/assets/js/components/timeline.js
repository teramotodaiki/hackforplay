import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import { lightBlue50 } from 'material-ui/styles/colors';

import Chat from './chat';
import ActionBar from './action-bar';

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = { isAutoScroll: true };

  }

  componentDidMount() {
    this.timeline.addEventListener('scroll', ({ target }) => {
      const scrollFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
      this.setState({ isAutoScroll: scrollFromBottom <= 0 });
    });
  }

  componentDidUpdate() {
    if (this.state.isAutoScroll && !this.props.reverse) {
      this.timeline.scrollTop = this.timeline.scrollHeight;
    }
  }

  render() {
    const { chats, style, reverse, postChat, disabled } = this.props;

    const tl = chats.map((item) => <Chat key={item.id} {...item}></Chat>);
    if (reverse) tl.reverse();

    const actionBarStyle = {
      height: 48,
    };

    const divStyle = Object.assign({
      backgroundColor: lightBlue50,
    }, style);

    const timelineStyle = {
      overflow: 'scroll',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      height: divStyle.height - actionBarStyle.height,
      paddingTop: 20,
    };


    const actionBar = (
      <ActionBar
        style={actionBarStyle}
        postChat={postChat}
        disabled={disabled}
      />);

    return (<div style={divStyle}>
      {reverse ? actionBar : null}
      <div
        ref={(ref) => this.timeline = findDOMNode(ref)}
        style={timelineStyle}
      >
        {tl}
      </div>
      {reverse ? null : actionBar}
    </div>);
  }
}

Timeline.propTypes = {
};
