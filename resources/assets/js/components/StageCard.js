import React from 'react';
import { Card, CardHeader, CardActions, CardText, FlatButton, Avatar, FontIcon, FloatingActionButton } from 'material-ui';
import {blue500} from 'material-ui/styles/colors';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';

export default ({ stage, isOwner }) => {

  const cardStyle = {
    minWidth: 480,
  };

  const playButton = (
    <FloatingActionButton
      onTouchTap={() => location.href = "/s?id=" + stage.id}>
      <PlayArrow />
    </FloatingActionButton>
  );

  return (
    <Card style={cardStyle}>
      <CardHeader
        title={stage.title || '...'}
        subtitle={stage.explain || ''}
        avatar={playButton}
        actAsExpander={true}
        showExpandableButton={true}
      >
        {isOwner ? <AssignmentInd color={blue500} /> : null}
      </CardHeader>
      <CardActions>
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
