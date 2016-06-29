import React, { Component } from 'react';
import { Link } from 'react-router';

import { Button } from 'react-bootstrap';

export default class ChannelMenu extends Component {
  constructor(props) {
    super(props);

    this.style = {
      textAlign: 'center',
    };
  }

  render() {

    const { style, reload, createGist, raiseHand, channel: { ID } } = this.props;

    return (<div style={Object.assign({}, this.style, style)}>
      <Button bsStyle="link" bsSize="large" onClick={reload}>
        <span className="fa fa-refresh fa-3x"></span>
      </Button>
      <Button bsStyle="link" bsSize="large" onClick={createGist}>
        <span className="fa fa-github fa-3x"></span>
      </Button>
      <Button bsStyle="link" bsSize="large">
        <Link to={`/bells/create?channel=${ID}`}>
          <span className="fa fa-hand-paper-o fa-3x"></span>
        </Link>
      </Button>
    </div>);
  }
}

ChannelMenu.propTypes = {
};
