import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { fetchPlays, fetchStageIfNeeded } from '../actions/';
import StageCard from '../components/StageCard';

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

    const { dispatch, plays } = this.props;

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
      .map((stage) => (<StageCard key={stage.id} stage={stage} />));

    return (
      <div style={containerStyle}>
        {stageCards}
      </div>
    );
  }
}

Stages.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Stages);
