import React, { PropTypes, Component } from 'react';

import { Drawer, AppBar, IconButton } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';

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
