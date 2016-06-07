import React from 'react'

import IframeEmbed from './iframe-embed';
import { Row, Col } from "react-bootstrap";

class Channel extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div style={{height: '100vh', backgroundColor: 'black'}}>
        <Col lg={9} md={8} sm={7} xs={12} style={{'padding': '0'}}>
          <IframeEmbed type="project" token={this.props.params.projectToken} />
        </Col>
        <Col lg={3} md={4} sm={5} xs={12} style={{'padding': '0'}}>
          <div style={{height: '100vh', backgroundColor: 'white'}}></div>
        </Col>
      </div>
    );
  }

}

export default Channel;
