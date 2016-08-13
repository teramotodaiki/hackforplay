import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import {
  Tabs, Tab,
  Checkbox,
} from 'material-ui';
import Extension from 'material-ui/svg-icons/action/extension';
import VideogameAsset from 'material-ui/svg-icons/hardware/videogame-asset';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';

import {
  fetchPlays,
  fetchStage, getStageFromLocal, updateStage,
  fetchProject, getProjectFromLocal,
  fetchUser, getUserFromLocal,
} from '../actions/';
import StageCard from '../components/StageCard';
import Progress from '../components/Progress';

export default class Stages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyMe: false,
    };
  }

  componentDidMount() {
    const { dispatch, authUser } = this.props;

    const fetchTask = (result) => {
      const stage = result.body;
      dispatch(fetchUser(stage.user_id));
      if (authUser.id == stage.user_id) {
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

  getStageCardList({ is_mod, style }) {
    const { dispatch, plays, authUser } = this.props;
    const keyArrayOfPlays = Object.keys(plays);

    if (!keyArrayOfPlays.length) return null; // Loading...

    const cards = keyArrayOfPlays
      .sort((a, b) => b - a)
      .filter((id) => plays[id].deleted_at === null)
      .map((id) => plays[id].stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(getStageFromLocal(stage_id)))
      .filter((stage) => !!+stage.is_mod === is_mod)
      .filter((stage) => !this.state.onlyMe || authUser.id == stage.user_id)
      .map((stage) => (
        <StageCard
          key={stage.id}
          stage={stage}
          style={style}
          isOwner={authUser.id == stage.user_id}
          project={authUser.id == stage.user_id && stage.project_id ? dispatch(getProjectFromLocal(stage.project_id)) : null}
          user={stage.user_id && dispatch(getUserFromLocal(stage.user_id))}
          handleStageUpdate={(change) => dispatch(updateStage(stage.id, change))}
          />
      ));

    return cards.length ? cards : (
      <h1>Anything yet.</h1>
    );

  }

  render() {
    const { dispatch, authUser, containerStyle } = this.props;

    const style = Object.assign({}, containerStyle, {
      paddingLeft: 60,
      paddingRight: 60,
      paddingBottom: 60,
    });

    const cardStyle = {
      width: style.width - style.paddingLeft - style.paddingRight
    };

    const menu = (
      <Checkbox
        checked={this.state.onlyMe}
        onCheck={(e, value) => this.setState({ onlyMe: value })}
        checkedIcon={<AssignmentInd />}
        uncheckedIcon={<PermIdentity />}
      />
    );

    return (
      <div style={style}>
        {menu}
        <Tabs>
          <Tab
            icon={<VideogameAsset />}
            label="PRODUCT"
            >
            {
              this.getStageCardList({ is_mod: false, style: cardStyle }) ||
              (<Progress containerStyle={containerStyle} />)
            }
          </Tab>
          <Tab
            icon={<Extension />}
            label="MOD"
            >
            {
              this.getStageCardList({ is_mod: true, style: cardStyle }) ||
              (<Progress containerStyle={containerStyle} />)
            }
          </Tab>
        </Tabs>
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
