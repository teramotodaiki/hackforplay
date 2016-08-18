import React, { Component } from 'react';
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

    const divStyle = Object.assign({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
      height: height,
    }, style);

    const buttonStyle = {
      marginLeft: 6,
      marginRight: 6,
    };

    return (<div style={divStyle}>
      <Link to="/channels/list">
        <FlatButton
          label="home"
          icon={<Home />}
          style={buttonStyle}
        />
      </Link>
      <FlatButton
        label="retry"
        icon={<Refresh />}
        style={buttonStyle}
        onTouchTap={reload}
      />
      <FlatButton
        label="code"
        icon={<FontIcon className="fa fa-github"></FontIcon>}
        style={buttonStyle}
        onTouchTap={createGist}
      />
      <Link to={`/bells/create?channel=${channel.ID}`}>
        <FlatButton
          label="bell"
          icon={<PanTool />}
          style={buttonStyle}
        />
      </Link>
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

ChannelMenu.propTypes = {
};
