import React, { Component, PropTypes } from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import {
  Dialog, FlatButton
} from 'material-ui';
import { purple100, purple300 } from 'material-ui/styles/colors';

import IframeEmbed from '../components/IframeEmbed';
import Timeline from '../components/Timeline';
import ChannelMenu from '../components/channel-menu';
import { Section } from '../components/section';
import Progress from '../components/Progress';
import {
  addChat, postChat, getChats,
  fetchChannel, updateChannel,
  fetchQcard,
  fetchUserIfNeeded,
} from '../actions/';

const GITHUB_API = 'https://api.github.com';

class Channel extends Component {

  constructor(props) {
    super(props);

    this.state = { openArchiveDialog: false };

    this.reload = this.reload.bind(this);
    this.createGist = this.createGist.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
  }

  load(query) {
    const { dispatch } = this.props;
    const id = +this.props.params.id;

    return dispatch(fetchChannel(id, query))
      .then((result) => {
        if (query.chats) {
          dispatch(getChats())
          .filter((chat) => chat.user_id)
          .forEach((chat) => dispatch(fetchUserIfNeeded(chat.user_id)))
        }
        return result;
      })
      .catch((err) => console.error(0, err));
  }

  postChat (message) {
    const { dispatch, params } = this.props;
    dispatch(postChat(params.id, { message }));
  }

  reload () {
    this.load({ chats: false })
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

  handleArchive() {
    this.setState({ openArchiveDialog: true });
  }

  archive() {
    const { dispatch, params: {id} } = this.props;
    dispatch(updateChannel(id, { is_archived: true }))
    .then((value) => console.log(value))
    .catch((err) => console.error(0, err));

    this.setState({ openArchiveDialog: false });
  }

  componentDidMount() {
    const { dispatch, params: {id} } = this.props;

    this.load({ chats: true });

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
        <Progress size={5} />
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

    const archiveActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({ openArchiveDialog: false })}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.archive()}
      />,
    ];

    return (
      <div style={containerStyle}>
        <Dialog
          title="Archive Channel"
          open={this.state.openArchiveDialog}
          actions={archiveActions}
        >
          Are you sure to archive this channel?
        </Dialog>
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
            archive={this.handleArchive}
            isOwner={authUser && (authUser.id == channel.user_id)}
            height={menuHeight}
            style={menuStyle}
          />
        </div>
        <div style={rightStyle}>
          <Timeline
            channel={channel}
            style={timelineStyle}
            reverse={isSingle}
            postChat={this.postChat.bind(this)}
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
