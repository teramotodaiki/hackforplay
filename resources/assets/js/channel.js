import React, { Component } from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import { Row, Col } from "react-bootstrap";

import IframeEmbed from './iframe-embed';
import { fetchChannel } from './actions/';

class Channel extends Component {

  constructor(props) {
    super(props);

    const { dispatch, channels } = this.props;
    const id = +this.props.params.id;

    if (!channels[id]) {
      dispatch(fetchChannel({ id, chats: true }));
    }
  }

  render () {

    const id = +this.props.params.id;
    const channel = this.props.channels[id];

    const iframe = channel ? (
      <IframeEmbed type="project" token={channel.ProjectToken} />
    ) : null;

    return (
      <div style={{height: '100vh', backgroundColor: 'black'}}>
        <Col lg={9} md={8} sm={7} xs={12} style={{'padding': '0'}}>
          {iframe}
        </Col>
        <Col lg={3} md={4} sm={5} xs={12} style={{'padding': '0'}}>
          <div style={{height: '100vh', backgroundColor: 'white'}}></div>
        </Col>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Channel);
