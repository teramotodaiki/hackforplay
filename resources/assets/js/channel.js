import React, { Component } from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import { Row, Col } from "react-bootstrap";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";
import Pusher from 'pusher-js';

import IframeEmbed from './iframe-embed';
import Timeline from './components/timeline';
import ActionBar from './components/action-bar';
import ChannelMenu from './components/channel-menu';
import { addChat, postChat, fetchChannel, createGist, fetchQcard } from './actions/';

class Channel extends Component {

  constructor(props) {
    super(props);
    this.state = { inputValue: '' };

    const { dispatch, channels } = this.props;
    const id = +this.props.params.id;

    if (!channels[id]) {
      dispatch(fetchChannel({ id, chats: true }));
    }

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = false;

    const pusherKey = document.querySelector('meta[name="pusher-key"]').getAttribute('content');
    const pusher = new Pusher(pusherKey, {
      encrypted: true
    });

    const channel = pusher.subscribe('channel-' + id);
    channel.bind('new_message', (data) => {
      dispatch(addChat(id, data));
    });

    this.loginUserId = document.querySelector('meta[name="login-user-id"]').getAttribute('content');

    this.reload = this.reload.bind(this);
    this.createGist = this.createGist.bind(this);
  }

  postChat (message) {
    const { dispatch, params } = this.props;
    dispatch(postChat(params.id, { message }));
  }

  reload () {
    this.iframe.contentWindow.location.reload(true);
    this.iframe.focus();
  }

  createGist () {
    const { dispatch, params, channels } = this.props;
    const channel = channels[params.id];

    const gistName = `channel-${params.id}.js`;
    const gistWindow = window.open('about:blank', gistName);
    dispatch(createGist({
      [gistName]: {
        'content': channel.script.RawCode,
      }
    }))
    .then(({ body }) => {
      gistWindow.location.href = body.html_url;
      this.postChat('Created new gist!→' + body.html_url);
    })
    .catch(() => gistWindow.close());
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate());
  }

  render () {

    const id = +this.props.params.id;
    const channel = this.props.channels[id];

    const containerStyle = {
      height: window.innerHeight,
      backgroundColor: channel && channel.is_archived ? 'rgb(196, 149, 138)' : 'inherit',
    };

    const leftStyle = { 'padding': '0' };
    const rightStyle = {
      padding: '0',
      height: '100%',
      border: '1px solid #eceeef',
      backgroundColor: '#f7fafb',
    };
    const actionBarStyle = {
      height: 48,
      backgroundColor: 'white',
    };
    const timelineStyle = {
      height: window.innerHeight - actionBarStyle.height,
    };

    const iframe = channel ? (
      <IframeEmbed
        ref={(embed) => this.iframe = embed ? embed.iframe : null}
        type="project"
        token={channel.ProjectToken}
        visibleFocus
        />
    ) : null;

    const menu = channel ? (
      <ChannelMenu
        channel={channel}
        reload={this.reload}
        createGist={this.createGist}
        style={{ backgroundColor: 'white' }}
        isOwner={+this.loginUserId === +channel.UserID}
        />
    ) : null;

    return (
      <div style={containerStyle}>
        <Col lg={9} md={8} sm={7} xs={12} style={leftStyle}>
          {iframe}
          {menu}
        </Col>
        <Col lg={3} md={4} sm={5} xs={11} style={rightStyle}>
          <Timeline
            chats={channel && channel.chats ? channel.chats : []}
            style={timelineStyle}
            />
          <ActionBar
            postChat={this.postChat.bind(this)}
            style={actionBarStyle}
            disabled={!!(channel && channel.is_archived)}
            />
        </Col>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Channel);
