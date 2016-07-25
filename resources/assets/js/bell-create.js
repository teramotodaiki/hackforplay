import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { Section } from './components/section';
import { fetchChannel, fetchTeam, postBell } from './actions/';

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
    const fakeResult = { body: channels[query.channel] };

    Promise.resolve(fakeResult)
    .then((result) => result.body ?
      result :
      dispatch(fetchChannel({ id: query.channel, chats: false }))
    )
    .then((result) => dispatch(fetchTeam(result.body.TeamID)))
    .then((result) => this.setState({ team: result.body, isLoading: false }));
  }

  raiseHand() {
    const { dispatch, channels, location: { query } } = this.props;
    const { ID, TeamID } = channels[query.channel];

    this.setState({ isLoading: true });
    dispatch(postBell(TeamID, ID))
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
      <Section name="bell" style={{
        height: window.innerHeight - this.context.muiTheme.appBar.height
      }}>
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
