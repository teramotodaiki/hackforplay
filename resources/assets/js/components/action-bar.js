import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';

export default class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.style = {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      margin: 0,
    };
  }

  render() {
    const { style } = this.props;
    const colStyle = {
      margin: 0,
      padding: 0,
      height: style.height,
    };
    const inputStyle = {
      border: 'none',
      outline: 'none',
      resize: 'none',
      width: '100%',
      height: style.height - 4,
      overflowY: 'scroll',
      paddingTop: 4,
    }

    return (<Row style={Object.assign({}, this.style, style)}>
      <Col xs={1} style={colStyle}>
        <span>😄</span>
      </Col>
      <Col xs={10} style={colStyle}>
        <textarea style={inputStyle}></textarea>
      </Col>
      <Col xs={1} style={colStyle}>
        <span className="fa fa-paper-plane-o"></span>
      </Col>
    </Row>);
  }
}

ActionBar.propTypes = {
};
