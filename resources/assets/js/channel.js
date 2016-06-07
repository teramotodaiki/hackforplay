import React from 'react'

import IframeEmbed from './iframe-embed';
import { Row, Col } from "react-bootstrap";

class Channel extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Row style={{height: '100vh', backgroundColor: 'black'}}>
        <Col lg={9} md={8} sm={7} xs={12}>
          <IframeEmbed type="project" token={this.props.params.projectToken} />
        </Col>
        <Col lg={3} md={4} sm={5} xs={12}>
          <div style={{height: '100vh', backgroundColor: 'white'}}></div>
        </Col>
      </Row>
    );
  }

}

export default Channel;
