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
  setChat, indexChat, storeChat,
  showChannel, showChannelIfNeeded, updateChannel,
  createGist,
  fetchQcard,
} from '../actions/';


class Channel extends Component {

  constructor(props) {
    super(props);

    this.state = { openArchiveDialog: false };
    this.id = +props.params.id;

    this.reload = this.reload.bind(this);
    this.createGist = this.createGist.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
  }

  postChat (message) {
    const { dispatch } = this.props;
    dispatch(storeChat({ channel_id: this.id, message }));
  }

  reload () {
    const { dispatch } = this.props;
    dispatch(showChannel({ id: this.id }))
    .then((result) => {
      this.iframe.reload(false);
      this.iframe.focus();
    });
  }

  createGist () {
    const { dispatch, params, channels } = this.props;
    const channel = channels.get(this.id);

    const gistWindow = window.open('about:blank', `channel-${channel.id}.js`);

    dispatch(createGist(channel))
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
    dispatch(updateChannel(id, { is_archived: true }));

    this.setState({ openArchiveDialog: false });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(showChannelIfNeeded({ id: this.id }));

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = false;

    const pusherKey = document.querySelector('meta[name="pusher-key"]').getAttribute('content');
    const pusher = new Pusher(pusherKey, {
      encrypted: true
    });

    const channel = pusher.subscribe('channel-' + this.id);
    channel.bind('new_message', (data) => {
      dispatch(setChat(data));
    });
  }

  render () {

    const { channels, dispatch, authUser } = this.props;
    const channel = channels.get(this.id, null);

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
            reload={this.reload.bind(this)}
            createGist={this.createGist}
            archive={this.handleArchive}
            isOwner={authUser && (authUser.id === channel.user_id)}
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
