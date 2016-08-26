import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';

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
  indexPlay,
  showStageIfNeeded, updateStage,
  showProjectIfNeeded,
  showUserIfNeeded,
  indexPlug, updatePlug, storePlug,
  indexAuthor, storeAuthor,
} from '../actions/';
import StageCard from '../components/StageCard';
import ModStageCard from '../components/ModStageCard';
import Progress from '../components/Progress';
import LoadMore from '../components/LoadMore';
import PlugDrawer from '../components/PlugDrawer';
import AuthorDrawer from '../components/AuthorDrawer';

export default class History extends Component {
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
      noAuthor: false,
    };

    this.handleConnect = this.handleConnect.bind(this);
    this.handlePlugSelect = this.handlePlugSelect.bind(this);
    this.handlePostAuthor = this.handlePostAuthor.bind(this);
    this.handleToggleVisiblity = this.handleToggleVisiblity.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(indexPlug());
    dispatch(indexAuthor())
    .then((result) =>
      this.setState({ noAuthor: this.props.authors.count === 0 }));
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
        dispatch(showUserIfNeeded({ id: stage.user_id }));
      }
      if (authUser.id == stage.user_id) {
        dispatch(showProjectIfNeeded({ id: stage.project_id }));
      }
    };

    const fetchStages = result.body.data
      .filter((play) => play.deleted_at === null && play.stage_id)
      .map((play) => play.stage_id)
      .filter((stage_id, i, self) => stage_id && self.indexOf(stage_id) === i)
      .map((stage_id) => dispatch(showStageIfNeeded({ id: stage_id })))
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
            dispatch(storePlug({
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

  handleToggleVisiblity(plug) {
    const { dispatch } = this.props;
    return dispatch(updatePlug(plug.id, { is_visible: !plug.is_visible }));
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
    return dispatch(storeAuthor(author));
  }

  getStageCardList({ style }) {
    const { dispatch, plays, projects, stages, plugs, authUser, users } = this.props;
    const { selectedPlug } = this.state;

    if (plays.count() === 0) return null; // Loading...

    const cards =
      plays
      .filter((play) => play.deleted_at === null && play.stage_id)
      .sort((a, b) => b.id - a.id)
      .map((play) => play.stage_id)
      .toArray()
      .filter((stage_id, i, self) => self.indexOf(stage_id) === i)
      .map((stage_id) => stages.get(stage_id, { isLoading: true }))
      .filter((stage) => !stage.isLoading)
      .filter((stage) => stage.is_mod === this.state.showMod)
      .filter((stage) => !this.state.onlyMe || authUser.id === stage.user_id)
      .filter((stage) => ['published', 'private', 'judging', 'pending'].indexOf(stage.state) > -1)
      .map((stage) => {
        const isOwner = authUser.id === stage.user_id;
        return {
          key: stage.id,
          isMod: stage.is_mod,
          style: style,
          stage: stage,
          isOwner: isOwner,
          project: isOwner ? projects.get(stage.project_id, null) : null,
          user: users.get(stage.user_id, null),
          handleStageUpdate: (change) => dispatch(updateStage(stage.id, change)),
        };
      })
      .map((params) => (
        params.isMod ?
          <ModStageCard {...params}
            selectedPlug={selectedPlug}
            plugs={plugs.filter((plug) => plug.stage_id === params.stage.id).toArray()}
            handleConnect={this.handleConnect}
            handleToggleVisiblity={this.handleToggleVisiblity}
          /> :
          <StageCard {...params} />
      ));

    return cards.length ? cards : (
      <h1>Anything yet.</h1>
    );

  }

  render() {
    const { dispatch, authUser, containerStyle, authors, plugs } = this.props;
    const { showMod, connectDialog } = this.state;
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
        {this.getStageCardList({ style: cardStyle })}
        {<LoadMore
          handleLoad={() => dispatch(indexPlay({ page: this.state.page }))}
          onLoaded={(result) => this.loadResolved(result)}
          size={5}
          first={authors.count() === 0}
        />}
        {showMod ? (
          this.state.noAuthor ? (
            <AuthorDrawer
              handlePostAuthor={this.handlePostAuthor}
            />
          ) :
          authors.count() === 0 ? (
            null
          ) : (
            <PlugDrawer
              plugs={plugs.toArray()}
              authors={authors.toArray()}
              selectedPlug={this.state.selectedPlug}
              handlePlugSelect={this.handlePlugSelect}
            />
          )
        ) : null}
      </div>
    );
  }
}

History.propTypes = {
};

History.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(History);
