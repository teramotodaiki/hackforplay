import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, Checkbox, HelpBlock } from 'react-bootstrap';

import { Section, CardSection, Arrow } from './components/section';
import { fetchMyTeams, postChannel } from './actions/';

const statics = {
  landing: {
    name: 'Landing',
    label: "landing-label",
    contents: [
      'a',
      'b',
      'c',
    ],
    next: 'Team',
  },
  team: {
    name: 'Team',
    label: "team-label",
    descriptions: [
      'a',
      'b',
      'c',
    ],
    nameIfNoTeam: '',
    displayNameIfNoTeam: 'Only Me',
    next: 'Description',
  },
  description: {
    name: 'Description',
    label: "description-label",
    descriptions: [
      'a',
      'b',
      'c',
    ],
    placeholder: 'e.g.) @@@@@@@@@@@@@@@',
    next: 'Private',
  },
  private: {
    name: 'Private',
    label: "private-label",
    descriptions: [
      'a',
      'b',
      'c',
    ],
    next: 'Result',
  },
  result: {
    name: 'Result',
    components: {
      // column key => component.name
      team: 'Team',
      description: 'Description',
      is_private: 'Private',
      project_token: 'Result',
    },
  },
};

class ChannelCreate extends Component {
  constructor(props, { router }) {
    super(props);

    const { location: { query } } = props;

    if (!query.project_token &&
      confirm('Missing project_token so you cannot make a channel. Do you want to close this window?'))
    {
      close();
    }

    this.state = {
      myTeams: [],
      channel: {
        team: statics.team.nameIfNoTeam,
        description: '',
        is_private: false,
        project_token: query.project_token,
      },
      isLoading: false,
      errors: null,
    };

    this.updateChannel = this.updateChannel.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.redirect = (...args) => router.push.apply(router, args);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchMyTeams())
    .then((result) => {
      if (result.body.data.length > 0) {
        this.setState({ myTeams: result.body.data });
        this.updateChannel({ team: result.body.data[0].Name });
      }
    });
  }

  updateChannel(inputs) {
    const channel = Object.assign({}, this.state.channel, inputs);
    this.setState({ channel });
  }

  createChannel() {
    const { dispatch } = this.props;
    const { channel } = this.state;

    this.setState({ isLoading: true });
    dispatch(postChannel(channel))
    .then((result) => this.redirect(`/channels/${result.body.ID}/watch`))
    .catch((err) => this.setState({ errors: err.response.body, isLoading: true }));
  }

  render() {
    const { myTeams, channel, isLoading, errors } = this.state;

    return (
      <div>
        <Landing {...statics.landing} />
        <Team {...statics.team} myTeams={myTeams} channel={channel} update={this.updateChannel} />
        <Description {...statics.description} channel={channel} update={this.updateChannel} />
        <Private {...statics.private} channel={channel} update={this.updateChannel} create={this.createChannel} />
        <Result {...statics.result} channel={channel} errors={errors} />
      </div>
    );
  }
}

ChannelCreate.contextTypes = {
  router: PropTypes.object.isRequired
};
ChannelCreate.propTypes = {
};

const Landing = (props) => {

  const contents = props.contents.map((item) => (
    <p key={item}>
      <span className="fa fa-check-circle-o text-success" />
      <span> {item}</span>
    </p>
  ));

  return (
    <CardSection {...props}>
      <div style={{ textAlign: 'center' }}>
        <h3>{props.label}</h3>
        {contents}
      </div>
    </CardSection>
  );

};

const Team = (props) => {
  const { myTeams, channel: { team }, update } = props;
  const status = team !== props.nameIfNoTeam ? 'success' : 'warning';

  const options = [{
    Name: props.nameIfNoTeam,
    DisplayName: props.displayNameIfNoTeam,
  }].concat(myTeams).map((item) => (
    <option key={item.Name} value={item.Name}>{item.DisplayName}</option>
  ));

  return (
    <CardSection {...props}>
      <FormGroup bsSize="large" validationState={status}>
        <FormControl
          componentClass="select"
          onChange={(e) => update({ team: e.target.value })}
          value={team}
          >
          {options}
        </FormControl>
        <HelpBlock>{props.label}</HelpBlock>
      </FormGroup>
    </CardSection>
  );

};

const Description = (props) => {
  const { channel: { description }, update } = props;
  const status = description ? 'success' : 'warning';

  return (
    <CardSection {...props}>
      <FormGroup bsSize="large" validationState={status}>
        <FormControl
          componentClass="textarea"
          placeholder={props.placeholder}
          onChange={(e) => update({ description: e.target.value })}
          value={description}
          />
        <HelpBlock>{props.label}</HelpBlock>
      </FormGroup>
    </CardSection>
  );

};

const Private = (props) => {
  const { channel: { is_private }, update, create } = props;

  return (
    <CardSection {...props} onMoveNext={() => create()}>
      <Checkbox
        checked={is_private}
        style={{ textAlign: 'center' }}
        onChange={(e) => update({ is_private: e.target.checked })}
        value={is_private}
        >
        {props.label}
      </Checkbox>
    </CardSection>
  );

};

const Result = (props) => {

  const error = props.errors ? (

    Object.keys(props.errors).map((key) => {
      return (
        <div key={key} className="text-danger" style={{ fontSize: '3rem' }}>
          <span>{props.errors[key]}</span>
          <Arrow to={props.components[key]} faClass="fa fa-arrow-up" />
        </div>
      );
    })

  ) : 'Result';

  return (
    <Section {...props}>
      {error}
    </Section>
  );

};



const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelCreate);
