import React from 'react';
import { Card, CardHeader, CardActions, CardText, FlatButton } from 'material-ui';

export default ({ stage }) => {

  const cardStyle = {
    minWidth: 480,
  };

  return (
    <Card style={cardStyle}>
      <CardHeader
        title={stage.title || '...'}
        subtitle={stage.explain || ''}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardActions>
        <FlatButton label="Action1" />
        <FlatButton label="Action2" />
      </CardActions>
      <CardText expandable={true}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
      </CardText>
    </Card>
  );
};
