import React from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import { Row, Col } from "react-bootstrap";

import IframeEmbed from './iframe-embed';
import { fetchChannel } from './actions/';

class Channel extends React.Component {

  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    const id = this.props.params.id;

    this.state = {
      projectToken: ''
    };

    dispatch(fetchChannel(id));

  }

  render () {

    return (
      <div style={{height: '100vh', backgroundColor: 'black'}}>
        <Col lg={9} md={8} sm={7} xs={12} style={{'padding': '0'}}>
          <IframeEmbed type="project" token={this.state.projectToken} />
        </Col>
        <Col lg={3} md={4} sm={5} xs={12} style={{'padding': '0'}}>
          <div style={{height: '100vh', backgroundColor: 'white'}}></div>
        </Col>
      </div>
    );
  }

}

export default connect()(Channel);
