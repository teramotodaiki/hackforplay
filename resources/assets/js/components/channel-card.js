import React, { Component, PropTypes } from 'react';

import {
  Card, CardHeader, CardMedia, CardTitle,
  FlatButton,
} from 'material-ui';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';


export default class ChannelCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { channel, user } = this.props;
    const { router } = this.context;

    const style = {
      width: 320,
      marginTop: 10,
      marginLeft: 10,
    };

    const mediaStyle = {
      cursor: 'pointer',
    };

    const userButton = (
      <FlatButton
        label={user && user.nickname}
        onTouchTap={() => location.href = '/m?id=' + user.id}
        icon={<PermIdentity />}
      />
    );

    return (
      <Card style={style}>
        <CardHeader
          title={userButton}
        />
        <CardMedia
          style={mediaStyle}
          overlay={<CardTitle title={channel.description} />}
          onTouchTap={() => router.push(`/channels/${channel.id}/watch`)}
        >
          <img src={channel.thumbnail} />
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
