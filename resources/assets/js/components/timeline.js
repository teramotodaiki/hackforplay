import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import { lightBlue50 } from 'material-ui/styles/colors';

import Chat from './chat';
import ActionBar from './action-bar';
import { getChats, getUserFromLocal } from '../actions/';

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
    };

    const talkerStyle = {
      marginLeft: 10,
      marginTop: 16,
      fontWeight: 600,
      fontSize: '80%',
    };

    const chatStyle = {
      marginLeft: 16,
      marginTop: 6,
    };

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
      <div key={item.key} style={talkerStyle}>
        {item._talker && dispatch(getUserFromLocal(item._talker)).nickname}
      </div> :
      <Chat key={item.id} chat={item} style={chatStyle} />
    );

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
