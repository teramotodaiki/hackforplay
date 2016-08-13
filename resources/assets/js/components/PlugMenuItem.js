import React, { PropTypes, Component } from 'react';

import { MenuItem } from 'material-ui';
import Settings from 'material-ui/svg-icons/action/settings';

export default ({ plug, handleTouchTap, style }) => {
  return (
    <MenuItem
      onTouchTap={() => handleTouchTap(plug)}
      rightIcon={<Settings color="#ffffff" />}
      style={style}
    >
      {plug.full_label}
    </MenuItem>
  );
}
