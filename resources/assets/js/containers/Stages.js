import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { fetchPlays, fetchStageIfNeeded, fetchProjectIfNeeded } from '../actions/';
import StageCard from '../components/StageCard';
import Progress from '../components/Progress';

export default class Stages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, plays } = this.props;
    if (!Object.keys(plays).length) {
      dispatch(fetchPlays());
    }
  }

  render() {

    const { dispatch, plays, authUser } = this.props;

    const containerStyle = Object.assign({}, this.props.containerStyle, {
      paddingLeft: 60,
      paddingRight: 60,
    });

    const stageCards = Object.keys(plays)
      .sort((a, b) => b - a)
      .filter((id) => plays[id].deleted_at === null)
      .map((id) => plays[id].stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(fetchStageIfNeeded(stage_id)))
      .map((stage) => {
        return (
          <StageCard
            key={stage.id}
            stage={stage}
            isOwner={authUser.id === stage.user_id}
            project={authUser.id === stage.user_id ? dispatch(fetchProjectIfNeeded(stage.project_id)) : null} />
        );
      });

    return (
      <div style={containerStyle}>
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
