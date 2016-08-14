import React, { PropTypes, Component } from 'react';

import {
  Drawer, AppBar, IconButton,
  FloatingActionButton, Popover, Menu, MenuItem, TextField,
} from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';
import ContentAdd from 'material-ui/svg-icons/content/add';

import PlugMenuItem from './PlugMenuItem';

export default class PlugDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      draft: null,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleCreateDraft = this.handleCreateDraft.bind(this);
    this.handleUpdateDraft = this.handleUpdateDraft.bind(this);
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose () {
    this.setState({ open: false });
  }

  handleCreateDraft(event, menuItem) {
    this.setState({
      open: false,
      draft: {
        prefix: menuItem.props.primaryText + '/',
        label: '',
      },
    });
  }

  handleUpdateDraft(event, input) {
    this.setState({
      draft: Object.assign({}, this.state.draft, {
        label: input,
      })
    });
  }

  render() {

    const { plugs, authors, selectedPlug, handlePlugSelect } = this.props;
    const { palette } = this.context.muiTheme;
    const { draft } = this.state;
    const selectedPlugId = selectedPlug && selectedPlug.id;

    return (
      <Drawer
        open={true}
        openSecondary={true}
      >
        <AppBar
          title="Plug"
          iconElementLeft={
            <IconButton
              onTouchTap={() => handlePlugSelect({ id: null })}
            >
              <Power />
            </IconButton>
          }
        />
        {plugs.map((plug) => (
          <PlugMenuItem
            key={plug.id}
            plug={plug}
            handleTouchTap={handlePlugSelect}
            style={plug.id === selectedPlugId ? { color: palette.primary1Color } : null}
          />
        ))}
        {draft ? (
          <MenuItem>
            <TextField
              name="draft"
              fullWidth={true}
              onChange={this.handleUpdateDraft}
              floatingLabelText={draft.prefix}
              value={draft.label}
            />
          </MenuItem>
        ) : (
          <FloatingActionButton
            mini={true}
            style={{ marginLeft: 10, marginTop: 10 }}
            onTouchTap={this.handleOpen}
          >
            <ContentAdd />
          </FloatingActionButton>
        )}
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
        >
          <Menu onItemTouchTap={this.handleCreateDraft}>
            {authors.map((author) => (
              <MenuItem key={author.id} primaryText={author.name} />
            ))}
          </Menu>
        </Popover>
      </Drawer>
    );
  }
}

PlugDrawer.propTypes = {
  plugs: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  selectedPlug: PropTypes.object,
  handlePlugSelect: PropTypes.func.isRequired,
};

PlugDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};
