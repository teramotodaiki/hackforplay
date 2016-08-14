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
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleCreateDraft = this.handleCreateDraft.bind(this);
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
    this.setState({ open: false });
    this.props.handlePlugSelect({
      id: {},
      label: '',
      isDraft: true,
      author: menuItem.props.value
    });
  }

  updateDraft(input) {
    const { selectedPlug } = this.props;
    const plug = Object.assign({}, selectedPlug, { label: input });
    this.props.handlePlugSelect(plug);
  }

  render() {

    const { plugs, authors, selectedPlug, handlePlugSelect } = this.props;
    const { palette } = this.context.muiTheme;
    const selectedPlugId = selectedPlug && selectedPlug.id;
    const hasDraft = selectedPlug && typeof selectedPlug.id === 'object';

    return (
      <Drawer
        open={true}
        openSecondary={true}
      >
        <AppBar
          title="Plug"
          iconElementLeft={
            <IconButton
              onTouchTap={() => handlePlugSelect(null)}
            >
              <Power />
            </IconButton>
          }
        />
        {plugs.map((plug) => (
          <PlugMenuItem
            key={plug.id}
            plug={plug}
            handleTouchTap={hasDraft ? null : handlePlugSelect}
            style={plug.id === selectedPlugId ? { color: palette.primary1Color } : null}
          />
        ))}
        {hasDraft ? (
          <MenuItem>
            <TextField
              name="draft"
              fullWidth={true}
              floatingLabelText={selectedPlug.author.name + '/'}
              value={selectedPlug.label}
              onChange={(e, input) => this.updateDraft(input)}
            />
          </MenuItem>
        ) : null}
        <FloatingActionButton
          mini={true}
          style={{ marginLeft: 10, marginTop: 10 }}
          onTouchTap={this.handleOpen}
          disabled={hasDraft}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
        >
          <Menu onItemTouchTap={this.handleCreateDraft}>
            {authors.map((author) => (
              <MenuItem
                key={author.id}
                primaryText={author.name}
                value={author}
              />
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
