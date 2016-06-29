import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

class BellCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: null,
      isLoading: true,
    };
  }

  render() {
    return (<div>MyComponent</div>);
  }
}

BellCreate.contextTypes = {
  router: PropTypes.object.isRequired
};
BellCreate.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(BellCreate);
