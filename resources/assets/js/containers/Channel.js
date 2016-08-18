import React, { Component, PropTypes } from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { purple100, purple300 } from 'material-ui/styles/colors';

import IframeEmbed from '../components/IframeEmbed';
import Timeline from '../components/timeline';
import ChannelMenu from '../components/channel-menu';
import { Section } from '../components/section';
import {
  addChat, postChat,
  fetchChannel, updateChannel,
  fetchQcard,
} from '../actions/';

const GITHUB_API = 'https://api.github.com';

class Channel extends Component {

  constructor(props) {
    super(props);

    this.state = { inputValue: '' };

    this.reload = this.reload.bind(this);
    this.createGist = this.createGist.bind(this);
    this.archive = this.archive.bind(this);
  }

  postChat (message) {
    const { dispatch, params } = this.props;
    dispatch(postChat(params.id, { message }));
  }

  reload () {
    const { dispatch } = this.props;
    const id = +this.props.params.id;

    dispatch(fetchChannel({ id, chats: true }))
    .then((result) => {
      this.iframe.contentWindow.location.reload(false);
      this.iframe.focus();
    });

  }

  createGist () {
    const { dispatch, params, channels } = this.props;
    const channel = channels[params.id];

    const gistName = `channel-${params.id}.js`;
    const gistWindow = window.open('about:blank', gistName);

    request
    .post(GITHUB_API + '/gists')
    .set('Accept', 'application/vnd.github.v3+json')
    .send({ public: true, files: {
      [gistName]: {'content': channel.head.RawCode} }
    })
    .then((result) => {
      gistWindow.location.href = result.body.html_url;
      this.postChat('Created new gist!→' + result.body.html_url);
    })
    .catch((err) => console.error(err) || gistWindow.close());

  }

  archive() {
    const { dispatch, params, channels } = this.props;
    const channel = channels[params.id];

    if (confirm('Are you sure to archive this channel? (このチャンネルを「そうこ」に入れてもよろしいですか？)')) {
      dispatch(updateChannel(
        Object.assign({}, channel, { is_archived: true })
      ))
      .then((result) => alert('Archived successfully. (「そうこ」に入りました)'));
    }
  }

  componentDidMount() {
    const { dispatch, channels, params: {id} } = this.props;

    dispatch(fetchChannel({ id, chats: true }));

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
  }

  render () {

    const { params, channels, dispatch, authUser } = this.props;
    const channel = channels[params.id];

    if (!channel) {
      return (
        <Section name="loading" style={this.props.containerStyle}>
          <span className="fa fa-spinner fa-pulse fa-10x fa-fw"></span>
        </Section>
      );
    }

    const marginSize = { width: 10, height: 10 };
    const columnWidth = Math.min(480, window.innerWidth);
    const menuHeight = 60;

    const isSingle = this.props.containerStyle.width < columnWidth * 2 + marginSize.width;


    const containerStyle = Object.assign({}, this.props.containerStyle, {
      backgroundColor: +channel.is_archived ? purple300 : purple100,
      display: 'flex',
      flexDirection: isSingle ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: isSingle ? 'center' : 'stretch',
      marginTop: 0,
      paddingTop: this.props.containerStyle.marginTop,
    });

    const leftStyle = {
      width: columnWidth,
    };
    const rightStyle = {
      width: columnWidth,
      marginTop: isSingle ? marginSize.height : 0,
      marginLeft: isSingle ? 0 : marginSize.width,
      height: window.innerHeight -
        this.context.muiTheme.appBar.height -
        containerStyle.paddingTop -
        marginSize.height,
    };
    const menuStyle = {
      marginTop: marginSize.height,
    };
    const timelineStyle = {
      height: rightStyle.height,
    };

    return (
      <div style={containerStyle}>
        <div style={leftStyle}>
          {channel.head && (
            <IframeEmbed
              ref={(embed) => this.iframe = embed ? embed.iframe : null}
              type="code"
              code={channel.head.raw_code}
              implicit_mod={channel.reserved.implicit_mod}
              visibleFocus
            />
          )}
          <ChannelMenu
            channel={channel}
            reload={this.reload}
            createGist={this.createGist}
            archive={this.archive}
            isOwner={authUser && (authUser.id == channel.user_id)}
            height={menuHeight}
            style={menuStyle}
          />
        </div>
        <div style={rightStyle}>
          <Timeline
            chats={channel.chats || []}
            style={timelineStyle}
            reverse={isSingle}
            postChat={this.postChat.bind(this)}
            disabled={!!+channel.is_archived}
          />
        </div>
      </div>
    );
  }

}

Channel.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Channel);
