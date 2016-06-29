import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { fetchChannel, fetchTeam } from './actions/';

class BellCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: null,
      isLoading: true,
    };
    
    if (!props.location.query.channel) {
      alert('Missing Channel');
    }
  }

  componentDidMount() {
    const { dispatch, channels, location: { query } } = this.props;
    const fakeResult = { body: channels[query.channel] };

    Promise.resolve(fakeResult)
    .then((result) => result.body ?
      result :
      dispatch(fetchChannel({ id: query.channel, chats: false }))
    )
    .then((result) => dispatch(fetchTeam(result.body.TeamID)))
    .then((result) => this.setState({ team: result.body, isLoading: false }));
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
