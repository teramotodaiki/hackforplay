import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';

export default class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.state = { inputValue: '' };

    this.style = {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      margin: 0,
    };

    this.postChatAndClear = this.postChatAndClear.bind(this);
    this.postChatByKey = this.postChatByKey.bind(this);
  }

  postChatAndClear() {
    if (this.state.inputValue) {
      this.props.postChat(this.state.inputValue);
      this.setState({ inputValue: '' });
    }
  }

  postChatByKey({ nativeEvent }) {
    if (nativeEvent.keyCode === 13 && !nativeEvent.shiftKey) {
      this.postChatAndClear();
      nativeEvent.preventDefault();
    }
  }

  render() {
    const { style } = this.props;
    const colStyle = {
      margin: 0,
      padding: '0 0 0 .25rem',
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
    };

    return (<Row style={Object.assign({}, this.style, style)}>
      <Col xs={10} style={colStyle}>
        <textarea
          value={this.state.inputValue}
          onChange={(e) => this.setState({ inputValue: e.target.value })}
          onKeyPress={this.postChatByKey}
          style={inputStyle}></textarea>
      </Col>
      <Col xs={2} style={colStyle}>
       <Button bsStyle="link" onClick={this.postChatAndClear} style={{ borderWidth: 0 }}>
         <span className="fa fa-paper-plane-o"></span>
       </Button>
      </Col>
    </Row>);
  }
}

ActionBar.propTypes = {
};
