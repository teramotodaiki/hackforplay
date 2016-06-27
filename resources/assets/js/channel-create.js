import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    next: 'Private',
  },
};

class ChannelCreate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Landing {...statics.landing} />
        <Team {...statics.team} />
        <Description {...statics.description} />
        <Private {...statics.private} />
      </div>
    );
  }
}

ChannelCreate.propTypes = {
};

const Landing = (props) => {

  return (
    <CardSection {...props}>
      <div style={{ textAlign: 'center' }}>
        <h3>{props.label}</h3>
      </div>
    </CardSection>
  );

};

const Team = (props) => {

  return (
    <CardSection {...props}>
      Team
    </CardSection>
  );

};

const Description = (props) => {

  return (
    <CardSection {...props}>
      Description
    </CardSection>
  );

};

const Private = (props) => {

  return (
    <CardSection {...props}>
      Private
    </CardSection>
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
