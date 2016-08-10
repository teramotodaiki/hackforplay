import React from 'react';
import { Card, CardHeader, CardActions, CardText, FlatButton, Avatar, FontIcon, FloatingActionButton } from 'material-ui';
import {blue500} from 'material-ui/styles/colors';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';

export default ({ stage, isOwner, project, style }) => {

  const cardStyle = Object.assign({
    width: 480,
    minWidth: 480,
  }, style);

  const wrapStyle = {
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: cardStyle.width / 2 >> 0,
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
        titleStyle={wrapStyle}
        subtitleStyle={wrapStyle}
      >
        {isOwner ? <AssignmentInd color={blue500} /> : null}
      </CardHeader>
      {isOwner && ownerActions}
    </Card>
  );
};
