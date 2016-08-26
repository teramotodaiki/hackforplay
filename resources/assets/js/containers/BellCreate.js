import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { Section } from '../components/section';
import { showChannelIfNeeded, fetchTeam, postBell } from '../actions/';

class BellCreate extends React.Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      team: null,
      isLoading: true,
    };

    if (!props.location.query.channel) {
      alert('Missing Channel');
    }

    this.goBack = (...args) => router.goBack.apply(router, args);
  }

  componentDidMount() {
    const { dispatch, channels, location: { query } } = this.props;
    const id = +query.channel;

    dispatch(showChannelIfNeeded({ id }))
    .then((result) => dispatch(fetchTeam(result.body.team_id)))
    .then((result) => this.setState({ team: result.body, isLoading: false }));
  }

  raiseHand() {
    const { dispatch, channels, location: { query } } = this.props;
    const id = +query.channel;

    this.setState({ isLoading: true });
    dispatch(postBell(this.state.team.id, id))
    .then((result) => {
      this.setState({ isLoading: false });
      this.goBack();
    });
  }

  render() {
    const { team, isLoading } = this.state;

    const loading = isLoading ? (
      <span className="fa fa-spinner fa-pulse fa-10x fa-fw"></span>
    ) : null;

    const hand = isLoading ? null : (
      <Button bsStyle="link" bsSize="large" onClick={() => this.raiseHand()}>
        <span className="fa fa-hand-paper-o fa-10x"></span>
      </Button>
    );

    const notice = team ? (
      <div style={{ maxWidth: '28rem' }}>
        <h3>{team.DisplayName}</h3>
        <p className="text-muted">{team.bell_notice}</p>
      </div>
    ) : null;

    return (
      <Section name="bell" style={this.props.containerStyle}>
        <div></div>
        <div></div>
        <div>
          {loading}
          {hand}
        </div>
        {notice}
      </Section>
    );
  }
}

BellCreate.contextTypes = {
  router: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
};
BellCreate.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(BellCreate);
