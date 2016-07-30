import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

export default class Stages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.containerStyle}>
        Content
      </div>
    );
  }
}

Stages.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Stages);
