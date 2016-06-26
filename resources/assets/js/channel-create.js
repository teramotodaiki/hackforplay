import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChannelCreate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>MyComponent</div>);
  }
}

ChannelCreate.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelCreate);
