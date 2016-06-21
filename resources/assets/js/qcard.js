import React, { Component } from 'react';
import { connect } from 'react-redux';

class Qcard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>MyComponent</div>);
  }
}

Qcard.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Qcard);
