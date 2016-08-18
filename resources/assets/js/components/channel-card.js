import React from 'react';

import { Card, CardHeader, CardMedia, Avatar, FlatButton } from 'material-ui';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';

export default ({channel, user}) => {

  const style = {
    width: 320,
    marginTop: 10,
    marginLeft: 10,
  };

  return (
    <Card style={style}>
      <CardHeader
        subtitle={channel.description}
        avatar={<Avatar icon={<PermIdentity />} />}
      />
      <CardMedia>
        <img src={channel.thumbnail} />
      </CardMedia>
    </Card>
  );
}
