import React, { Component } from 'react'
import request from 'superagent';

import { connect } from 'react-redux';
import { Row, Col } from "react-bootstrap";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";
import Pusher from 'pusher-js';

import IframeEmbed from './iframe-embed';
import { addChat, postChat, fetchChannel } from './actions/';

class Channel extends Component {

  constructor(props) {
    super(props);
    this.state = { inputValue: '' };

    const { dispatch, channels } = this.props;
    const id = +this.props.params.id;

    if (!channels[id]) {
      dispatch(fetchChannel({ id, chats: true }));
    }

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('4ca30417cb9ff30cc3f0', {
      encrypted: true
    });

    const channel = pusher.subscribe('channel-' + id);
    channel.bind('new_message', (data) => {
      dispatch(addChat(id, data));
    });
  }

  postChat (message) {
    const { dispatch, params } = this.props;
    dispatch(postChat(params.id, { message }));
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
          <div style={{height: '100vh', backgroundColor: 'white'}}>
            {channel ? channel.chats.map((item) => <p key={item.id}>{item.message}</p>) : null}
            <Form inline>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.inputValue}
                  placeholder="type here"
                  onChange={(e) => this.setState({ inputValue: e.target.value})}
                />
                <InputGroup.Button>
                  <Button onClick={() => this.postChat(this.state.inputValue)}>
                    Send
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Channel);
