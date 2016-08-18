import React, { Component, PropTypes } from 'react';

import {
  Card, CardHeader, CardMedia, CardTitle,
  FlatButton,
} from 'material-ui';
import { white } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';


export default class ChannelCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { on: false };
  }

  render() {
    const { channel, user } = this.props;
    const { router } = this.context;

    const style = {
      width: 320,
      marginTop: 20,
      marginLeft: 20,
    };

    const mediaStyle = {
      cursor: 'pointer',
    };

    const imgStyle = {
      width: style.width,
      height: style.width / 3 * 2,
    };

    const overlayStyle = {
      overflowX: 'hidden',
      maxHeight: imgStyle.height / 2,
      color: fade(white, 0.8),
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
    };

    const overlay = channel.description ? (
      <div style={overlayStyle}>
        {channel.description}
      </div>
    ) : null;

    const userButton = (
      <FlatButton
        label={user && user.nickname}
        onTouchTap={() => location.href = '/m?id=' + user.id}
        icon={<PermIdentity />}
      />
    );

    return (
      <Card style={style} zDepth={this.state.on ? 3 : 1}>
        <CardHeader
          title={userButton}
        />
        <CardMedia
          style={mediaStyle}
          overlay={overlay}
          onTouchTap={() => router.push(`/channels/${channel.id}/watch`)}
          onMouseEnter={() => this.setState({ on: true })}
          onMouseLeave={() => this.setState({ on: false })}
        >
          <img style={imgStyle} src={channel.thumbnail} />
        </CardMedia>
      </Card>
    );
  }
}

ChannelCard.propTypes = {
};

ChannelCard.contextTypes = {
  router: PropTypes.object.isRequired,
};
