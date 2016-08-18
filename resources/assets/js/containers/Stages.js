import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import {
  Tabs, Tab,
  Checkbox,
  Drawer, AppBar, IconButton, MenuItem,
  Dialog, FlatButton,
} from 'material-ui';
import Extension from 'material-ui/svg-icons/action/extension';
import VideogameAsset from 'material-ui/svg-icons/hardware/videogame-asset';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';

import {
  fetchPlays,
  fetchStageIfNeeded, getStageFromLocal, updateStage,
  fetchProjectIfNeeded, getProjectFromLocal,
  fetchUserIfNeeded, getUserFromLocal,
  fetchPlugs, getPlugs, updatePlug, postPlug,
  fetchAuthors, getAuthors, postAuthor,
} from '../actions/';
import StageCard from '../components/StageCard';
import ModStageCard from '../components/ModStageCard';
import Progress from '../components/Progress';
import LoadMore from '../components/LoadMore';
import PlugDrawer from '../components/PlugDrawer';
import AuthorDrawer from '../components/AuthorDrawer';

export default class Stages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyMe: false,
      showMod: false,
      page: 1,
      noMore: false,
      selectedPlug: null,
      connectDialog: {
        open: false,
      },
    };

    this.handleConnect = this.handleConnect.bind(this);
    this.handlePlugSelect = this.handlePlugSelect.bind(this);
    this.handlePostAuthor = this.handlePostAuthor.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPlugs());
    dispatch(fetchAuthors());
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

  handleConnect(stage) {
    const { dispatch } = this.props;
    const { selectedPlug } = this.state;
    if (!selectedPlug) return;

    if (typeof selectedPlug.id === 'number') {
      // Exist plug
      dispatch(updatePlug(selectedPlug.id, { stage: stage.id }));
      this.setState({ selectedPlug: null });
    } else {
      // New plug
      const fullLabel = selectedPlug.author.name + '/' + selectedPlug.label;
      this.setState({
        connectDialog: {
          open: true,
          text: `NOTICE: It is NOT editable that label of plug, OK? // ラベルは きめたら へんこうできません. よいですか？ [MOD: require('${fullLabel}')]`,
          confirm: () => {
            dispatch(postPlug({
              label: selectedPlug.label,
              author: selectedPlug.author.id,
              stage: stage.id,
            }));
            this.setState({
              selectedPlug: null,
              connectDialog: { open: false },
            });
          },
        },
      });
    }
  }

  handlePlugSelect(plug) {
    const { selectedPlug } = this.state;
    if (selectedPlug && typeof selectedPlug.id === 'object' &&
      (!plug || selectedPlug.id !== plug.id)) {
      const fullLabel = selectedPlug.author.name + '/' + selectedPlug.label;
      alert('Oops, before CONNECT ' + fullLabel);
    } else {
      this.setState({ selectedPlug: plug });
    }
  }

  handlePostAuthor(author) {
    const { dispatch } = this.props;
    return dispatch(postAuthor(author));
  }

  getStageCardList({ style }) {
    const { dispatch, plays, authUser } = this.props;
    const { selectedPlug } = this.state;
    const keyArrayOfPlays = Object.keys(plays);

    if (!keyArrayOfPlays.length) return null; // Loading...

    const plugs = dispatch(getPlugs());

    const cards = keyArrayOfPlays
      .sort((a, b) => b - a)
      .filter((id) => plays[id].deleted_at === null && plays[id].stage_id)
      .map((id) => plays[id].stage_id)
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(getStageFromLocal(stage_id)))
      .filter((stage) => !!+stage.is_mod === this.state.showMod)
      .filter((stage) => !this.state.onlyMe || authUser.id == stage.user_id)
      .filter((stage) => ['published', 'private', 'judging', 'pending'].indexOf(stage.state) > -1)
      .map((stage) => {
        const isOwner = authUser.id == stage.user_id;
        return {
          key: stage.id,
          isMod: stage.is_mod,
          style: style,
          stage: stage,
          isOwner: isOwner,
          project: isOwner && stage.project_id ? dispatch(getProjectFromLocal(stage.project_id)) : null,
          user: stage.user_id ? dispatch(getUserFromLocal(stage.user_id)) : null,
          handleStageUpdate: (change) => dispatch(updateStage(stage.id, change)),
        };
      })
      .map((params) => (
        params.isMod ?
          <ModStageCard {...params}
            selectedPlug={selectedPlug}
            plugs={plugs.filter((plug) => plug.stage_id == params.stage.id)}
            handleConnect={this.handleConnect}
          /> :
          <StageCard {...params} />
      ));

    return cards.length ? cards : (
      <h1>Anything yet.</h1>
    );

  }

  render() {
    const { dispatch, authUser, containerStyle } = this.props;
    const { showMod, connectDialog } = this.state;
    const { drawer } = this.context.muiTheme;
    const authors = dispatch(getAuthors());

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

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({ connectDialog: { open: false } })}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
          this.setState({ connectDialog: { open: false } });
          this.state.connectDialog.confirm();
        }}
      />,
    ];

    return (
      <div style={style}>
        <Dialog
          title={'Connect this stage?'}
          modal={true}
          open={connectDialog.open}
          actions={dialogActions}
        >
          {connectDialog.text}
        </Dialog>
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
          (<Progress size={5} />)
        }
        {
          !this.state.noMore && (
            <LoadMore
              handleLoad={() => dispatch(fetchPlays({ page: this.state.page }))}
              onLoaded={(result) => this.loadResolved(result)}
            />
          )
        }
        {showMod ? (
          !authors.length && !authors.isLoading ? (
            <AuthorDrawer
              handlePostAuthor={this.handlePostAuthor}
            />
          ) :
          !authors.length && authors.isLoading ? (
            null
          ) : (
            <PlugDrawer
              plugs={dispatch(getPlugs())}
              authors={authors}
              selectedPlug={this.state.selectedPlug}
              handlePlugSelect={this.handlePlugSelect}
            />
          )
        ) : null}
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
