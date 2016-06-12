import React, { Component } from 'react';

import { Button } from 'react-bootstrap';

export default class ChannelMenu extends Component {
  constructor(props) {
    super(props);

    this.style = {
      textAlign: 'center',
    };
  }

  render() {

    const { style, reload } = this.props;

    return (<div style={Object.assign({}, this.style, style)}>
      <Button bsStyle="link" bsSize="large" onClick={reload}>
        <span className="fa fa-refresh fa-3x"></span>
      </Button>
    </div>);
  }
}

ChannelMenu.propTypes = {
};
