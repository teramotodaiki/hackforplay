import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Section, CardSection, Arrow } from './components/section';

class ChannelCreate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Landing />
        <Team />
        <Description />
        <Private />
      </div>
    );
  }
}

ChannelCreate.propTypes = {
};

const Landing = (props) => {

  return (
    <CardSection name="Landing" next="Team">
      Landing
    </CardSection>
  );

};

const Team = (props) => {

  return (
    <CardSection name="Team" next="Description">
      Team
    </CardSection>
  );

};

const Description = (props) => {

  return (
    <CardSection name="Description" next="Private">
      Description
    </CardSection>
  );

};

const Private = (props) => {

  return (
    <CardSection name="Private" next="Private">
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
