import React, { PropTypes, Component } from 'react';
import {
  Card, CardHeader, CardActions, CardText,
  FlatButton, Avatar, FontIcon, FloatingActionButton,
  Toggle,
} from 'material-ui';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';

import UserChip from './UserChip';

export default class StageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { stage, isOwner, project, user, style, handleStageUpdate } = this.props;

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
      <CardActions style={{ paddingLeft: 16, paddingBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FloatingActionButton
          onTouchTap={() => {
            sessionStorage.setItem('project-token', project.token);
        		location.href = '/s?id=' + stage.source_id + '&mode=restaging';
          }}
          disabled={!project || !project.token}
          mini={true} secondary={true}
        >
          <FolderOpen />
        </FloatingActionButton>
        <div style={{ flexBasis: 100, marginTop: 'auto' }}>
          <Toggle
            label="MOD"
            defaultToggled={!!+stage.is_mod}
            disabled={stage.is_mod === undefined}
            onToggle={(event, value) => handleStageUpdate({ is_mod: value })}
            />
        </div>
        {this.props.cardActions}
      </CardActions>
    );

    const expandable = !!this.props.cardText;

    return (
      <Card style={cardStyle}>
        <CardHeader
          title={stage.title || '...'}
          subtitle={stage.explain || ''}
          avatar={playButton}
          titleStyle={wrapStyle}
          subtitleStyle={wrapStyle}
          actAsExpander={expandable}
          showExpandableButton={expandable}
        >
          {user && (<UserChip user={user} isOwner={isOwner} />)}
        </CardHeader>
        {isOwner && ownerActions}
        {this.props.cardText}
      </Card>
    );
  }
}

StageCard.propTypes = {
  stage: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
  project: PropTypes.object,
  user: PropTypes.object,
  style: PropTypes.object,
};

StageCard.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
