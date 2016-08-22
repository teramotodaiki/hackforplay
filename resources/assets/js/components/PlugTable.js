import React, { PropTypes, Component } from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { TextField, IconButton } from 'material-ui';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

export default class PlugTable extends Component {
  constructor(props) {
    super(props);
  }

  selectAll(event) {
    event.target.select(0, event.target.value.length - 1)
  }

  render() {
    const { plugs } = this.props;
    const { palette } = this.context.muiTheme;

    return (
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>code</TableHeaderColumn>
            <TableHeaderColumn>visibility</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
        {plugs.map((plug) => (
          <TableRow key={plug.id}>
            <TableRowColumn>
              <TextField
                key={plug.id}
                value={`require('${plug.full_label}');`}
                onTouchTap={this.selectAll}
              />
            </TableRowColumn>
            <TableRowColumn>
              <IconButton
                onTouchTap={() => this.props.handleToggleVisiblity(plug)}
              >
                {plug.is_visible ? <Visibility color={palette.primary1Color} /> : <VisibilityOff />}
              </IconButton>
            </TableRowColumn>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    );
  }
}

PlugTable.propTypes = {
};

PlugTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};
