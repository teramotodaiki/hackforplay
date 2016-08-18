import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import { lightBlue50 } from 'material-ui/styles/colors';

import Chat from './chat';
import ActionBar from './action-bar';
import { getChats } from '../actions/';

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
    const { channel, style, reverse, postChat, dispatch } = this.props;

    const tl = dispatch(getChats())
      .filter((item) => item.channel_id == channel.id);
    if (reverse) tl.reverse();

    const chats = tl
    .reduce((queue, chat) => {
      const last_talker = queue.length && queue[queue.length - 1].user_id;
      if (last_talker === chat.user_id) return queue.concat(chat);
      return queue.concat({ key: 'T' + chat.id, _talker: chat.user_id }, chat);

    }, [])
    .map((item) => '_talker' in item ?
      <div key={item.key}>{'Talker ' + item._talker}</div> :
      <Chat key={item.id} {...item} />
    );

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
        disabled={!!+channel.is_archived}
      />);

    return (<div style={divStyle}>
      {reverse ? actionBar : null}
      <div
        ref={(ref) => this.timeline = findDOMNode(ref)}
        style={timelineStyle}
      >
        {chats}
      </div>
      {reverse ? null : actionBar}
    </div>);
  }
}

Timeline.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Timeline);
