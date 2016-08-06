import React from 'react';
import { Card, CardHeader, CardActions, CardText, FlatButton, Avatar, FontIcon, FloatingActionButton } from 'material-ui';
import {blue500} from 'material-ui/styles/colors';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';

export default ({ stage, isOwner, project }) => {

  const cardStyle = {
    minWidth: 480,
  };

  const playButton = (
    <FloatingActionButton
      onTouchTap={() => location.href = "/s?id=" + stage.id}>
      {stage.thumbnail ? (<img src={stage.thumbnail} alt="Play" />) : (<PlayArrow />)}
    </FloatingActionButton>
  );

  const ownerActions = (
    <CardActions style={{ paddingLeft: 16, paddingBottom: 14 }}>
      <FloatingActionButton
        onTouchTap={() => {
          sessionStorage.setItem('project-token', project.token);
      		location.href = '/s?id=' + stage.source_id + '&mode=restaging';
        }}
        disabled={!project || !project.token}
        mini={true} secondary={true}>
        <FolderOpen />
      </FloatingActionButton>
    </CardActions>
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
      {isOwner && ownerActions}
      <CardText expandable={true}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
      </CardText>
    </Card>
  );
};
