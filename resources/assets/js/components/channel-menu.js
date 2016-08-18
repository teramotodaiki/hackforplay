import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { FlatButton, FontIcon } from 'material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import PanTool from 'material-ui/svg-icons/action/pan-tool';
import Archive from 'material-ui/svg-icons/content/archive';

export default class ChannelMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { height, reload, createGist, raiseHand, archive, channel, isOwner, style } = this.props;
    const { router } = this.context;

    const divStyle = Object.assign({
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
      height: height,
    }, style);

    const buttonStyle = {
      minWidth: 20,
    };

    return (<div style={divStyle}>
      <FlatButton
        label="home"
        icon={<Home />}
        style={buttonStyle}
        onTouchTap={() => router.push("/channels/list")}
      />
      <FlatButton
        label="retry"
        icon={<Refresh />}
        style={buttonStyle}
        onTouchTap={reload}
      />
      {!isOwner ? (
        <FlatButton
          label="code"
          icon={<FontIcon className="fa fa-github"></FontIcon>}
          style={buttonStyle}
          onTouchTap={createGist}
        />
      ) : null}
      <FlatButton
        label="bell"
        icon={<PanTool />}
        style={buttonStyle}
        onTouchTap={() => router.push(`/bells/create?channel=${channel.ID}`)}
      />
      {isOwner ? (
        <FlatButton
          label="archive"
          icon={<Archive />}
          style={buttonStyle}
          onTouchTap={archive}
          disabled={!!+channel.is_archived}
        />
      ) : null}
    </div>);
  }
}

ChannelMenu.contextTypes = {
  router: PropTypes.object.isRequired,
};

ChannelMenu.propTypes = {
};
