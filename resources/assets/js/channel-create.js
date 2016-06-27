import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, Checkbox } from 'react-bootstrap';

import { Section, CardSection, Arrow } from './components/section';

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
    name: 'Result'
  }
};

class ChannelCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTeams: [],
      channel: {
        team: statics.team.nameIfNoTeam,
        description: '',
        is_private: false,
      },
      isLoading: false,
    };

    this.updateChannel = this.updateChannel.bind(this);
  }

  updateChannel(inputs) {
    const channel = Object.assign({}, this.state.channel, inputs);
    this.setState({ channel });
  }

  render() {
    const { myTeams, channel, isLoading } = this.state;

    return (
      <div>
        <Landing {...statics.landing} />
        <Team {...statics.team} myTeams={myTeams} channel={channel} update={this.updateChannel} />
        <Description {...statics.description} channel={channel} update={this.updateChannel} />
        <Private {...statics.private} channel={channel} update={this.updateChannel} />
        <Result {...statics.result} channel={channel} />
      </div>
    );
  }
}

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

  const options = [{
    Name: props.nameIfNoTeam,
    DisplayName: props.displayNameIfNoTeam,
  }].concat(myTeams).map((item) => (
    <option key={item.Name} value={item.Name}>{item.DisplayName}</option>
  ));

  return (
    <CardSection {...props}>
      <FormGroup>
        <FormControl
          componentClass="select"
          onChange={(e) => update({ team: e.target.value })}
          value={team}
          >
          {options}
        </FormControl>
      </FormGroup>
    </CardSection>
  );

};

const Description = (props) => {
  const { channel: { description }, update } = props;

  return (
    <CardSection {...props}>
      <FormGroup>
        <FormControl
          componentClass="textarea"
          placeholder={props.placeholder}
          onChange={(e) => update({ description: e.target.value })}
          value={description}
          />
      </FormGroup>
    </CardSection>
  );

};

const Private = (props) => {
  const { channel: { is_private }, update } = props;

  return (
    <CardSection {...props}>
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

  return (
    <Section {...props}>
      Result
    </Section>
  );

};

const ErrorMessage = (props) => {

  return (
    <Section name="ErrorMessage">
      Errors
    </Section>
  );

};



const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelCreate);
