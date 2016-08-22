import React, { PropTypes, Component } from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class PlugTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { plugs } = this.props;

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
            <TableHeaderColumn>delete</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
        {plugs.map((plug) => (
          <TableRow key={plug.id}>
            <TableRowColumn>{`require('${plug.full_label}');`}</TableRowColumn>
            <TableRowColumn>{plug.is_visible + ''}</TableRowColumn>
            <TableRowColumn>delete</TableRowColumn>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    );
  }
}

PlugTable.propTypes = {
};
