import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
  fetchPlays,
  fetchStage, getStageFromLocal,
  fetchProject, getProjectFromLocal } from '../actions/';
import StageCard from '../components/StageCard';
import Progress from '../components/Progress';

export default class Stages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, authUser } = this.props;

    const fetchTask = (result) => {
      const stage = result.body;
      if (authUser.id === stage.user_id) {
        dispatch(fetchProject(stage.project_id));
      }
    };

    (Object.keys(this.props.plays).length ? Promise.resolve() : dispatch(fetchPlays()))
    .then(() => {
      Object.values(this.props.plays)
      .filter((play) => play.deleted_at === null)
      .map((play) => play.stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(fetchStage(stage_id)))
      .forEach((promise) => promise.then(fetchTask));
    });
  }

  render() {

    const { dispatch, plays, authUser, containerStyle } = this.props;

    const style = Object.assign({}, containerStyle, {
      paddingLeft: 60,
      paddingRight: 60,
    });

    const cardStyle = {
      width: style.width - style.paddingLeft - style.paddingRight
    };

    const stageCards = Object.keys(plays)
      .sort((a, b) => b - a)
      .filter((id) => plays[id].deleted_at === null)
      .map((id) => plays[id].stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(getStageFromLocal(stage_id)))
      .map((stage) => (
        <StageCard
          key={stage.id}
          stage={stage}
          style={cardStyle}
          isOwner={authUser.id == stage.user_id}
          project={authUser.id == stage.user_id && stage.project_id ? dispatch(getProjectFromLocal(stage.project_id)) : null} />
      ));

    return (
      <div style={style}>
        {stageCards.length ? stageCards : (
          <Progress containerStyle={containerStyle} />
        )}
      </div>
    );
  }
}

Stages.propTypes = {
};

Stages.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Stages);
