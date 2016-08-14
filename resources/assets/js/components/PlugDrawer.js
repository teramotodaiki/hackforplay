import React, { PropTypes, Component } from 'react';

import { Drawer, AppBar, IconButton, FloatingActionButton } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';
import ContentAdd from 'material-ui/svg-icons/content/add';

import PlugMenuItem from './PlugMenuItem';

export default class PlugDrawer extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { plugs, selectedPlugId, handlePlugSelect } = this.props;
    const { palette } = this.context.muiTheme;

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
        <FloatingActionButton
          mini={true}
          style={{ marginLeft: 10, marginTop: 10 }}
        >
          <ContentAdd />
        </FloatingActionButton>
      </Drawer>
    );
  }
}

PlugDrawer.propTypes = {
  plugs: PropTypes.array.isRequired,
  selectedPlugId: PropTypes.number,
  handlePlugSelect: PropTypes.func.isRequired,
};

PlugDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};
