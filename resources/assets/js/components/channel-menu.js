import React, { Component } from 'react';
import { Link } from 'react-router';

import { FlatButton, FontIcon } from 'material-ui';


export default class ChannelMenu extends Component {
  constructor(props) {
    super(props);

    this.style = {
      textAlign: 'center',
    };
  }

  render() {

    const { reload, createGist, raiseHand, archive, channel, isOwner } = this.props;

    const divStyle = {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
    };

    const buttonStyle = {
      margin: 10,
    };

    return (<div style={divStyle}>
      <FlatButton
        label="refresh"
        icon={<FontIcon className="fa fa-refresh"></FontIcon>}
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
          icon={<FontIcon className="fa fa-hand-paper-o"></FontIcon>}
          style={buttonStyle}
        />
      </Link>
      {isOwner ? (
        <FlatButton
          label="archive"
          icon={<FontIcon className="fa fa-archive"></FontIcon>}
          style={buttonStyle}
          onTouchTap={archive}
          disabled={+channel.is_archived}
        />
      ) : null}
    </div>);
  }
}

ChannelMenu.propTypes = {
};
