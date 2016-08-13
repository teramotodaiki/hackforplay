import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import {
  Tabs, Tab,
  Checkbox,
  Drawer, AppBar, IconButton,
} from 'material-ui';
import Extension from 'material-ui/svg-icons/action/extension';
import VideogameAsset from 'material-ui/svg-icons/hardware/videogame-asset';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import Power from 'material-ui/svg-icons/notification/power';

import {
  fetchPlays,
  fetchStageIfNeeded, getStageFromLocal, updateStage,
  fetchProjectIfNeeded, getProjectFromLocal,
  fetchUserIfNeeded, getUserFromLocal,
} from '../actions/';
import StageCard from '../components/StageCard';
import Progress from '../components/Progress';
import LoadMore from '../components/LoadMore';

export default class Stages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyMe: false,
      showMod: false,
      page: 1,
      noMore: false,
    };
  }

  loadResolved(result) {
    const { dispatch, authUser } = this.props;

    if (result.body.next_page_url) {
      this.setState({ page: result.body.current_page + 1 });
    } else {
      this.setState({ noMore: true });
    }

    const fetchTask = (result) => {
      const stage = result.body;
      if (stage.state !== 'published') return;
      if (stage.user_id) {
        dispatch(fetchUserIfNeeded(stage.user_id));
      }
      if (authUser.id == stage.user_id) {
        dispatch(fetchProjectIfNeeded(stage.project_id));
      }
    };

    const fetchStages = result.body.data
      .filter((play) => play.deleted_at === null && play.stage_id)
      .map((play) => play.stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(fetchStageIfNeeded(stage_id)))
      .map((promise) => promise.then(fetchTask));

    return Promise.all(fetchStages);
  }

  getStageCardList({ style }) {
    const { dispatch, plays, authUser } = this.props;
    const keyArrayOfPlays = Object.keys(plays);

    if (!keyArrayOfPlays.length) return null; // Loading...

    const cards = keyArrayOfPlays
      .sort((a, b) => b - a)
      .filter((id) => plays[id].deleted_at === null && plays[id].stage_id)
      .map((id) => plays[id].stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(getStageFromLocal(stage_id)))
      .filter((stage) => !!+stage.is_mod === this.state.showMod)
      .filter((stage) => !this.state.onlyMe || authUser.id == stage.user_id)
      .filter((stage) => stage.state === 'published')
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
    const { showMod } = this.state;
    const { drawer } = this.context.muiTheme;

    const style = Object.assign({}, containerStyle, {
      paddingLeft: 60,
      paddingRight: 60 + (showMod ? drawer.width : 0),
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
        uncheckedIcon={<AssignmentInd />}
        label={"Only Me"}
      />
    );

    return (
      <div style={style}>
        {menu}
        <Tabs
          onChange={(value) => typeof value === 'boolean' && this.setState({ showMod: value })}
          value={showMod}
        >
          <Tab
            icon={<VideogameAsset />}
            label="PRODUCT"
            value={false}
          />
          <Tab
            icon={<Extension />}
            label="MOD"
            value={true}
          />
        </Tabs>
        {
          this.getStageCardList({ style: cardStyle }) ||
          (<Progress containerStyle={containerStyle} />)
        }
        {
          !this.state.noMore && (
            <LoadMore
              handleLoad={() => dispatch(fetchPlays({ page: this.state.page }))}
              onLoaded={(result) => this.loadResolved(result)}
            />
          )
        }
        {
          showMod && (
            <Drawer
              open={true}
              openSecondary={true}
            >
              <AppBar
                title="Plug"
                iconElementLeft={<IconButton><Power /></IconButton>}
              />
            </Drawer>
          )
        }
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
