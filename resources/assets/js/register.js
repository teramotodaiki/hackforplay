import React from 'react';
import { scroller } from "react-scroll";
import Confirm from "./confirm";

import Merger from "./merger";
import { Section, Scroller } from "./section";


export default class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Landing />
        <Gender />
        <Nickname />
        <ID />
        <Password />
        <Result />
      </div>
    );
  }
}

const Landing = (props) => {
  return (
    <Section name="Landing">

    </Section>
  );
};

const Gender = (props) => {
  return (
    <Section name="Gender">

    </Section>
  );
};

const Nickname = (props) => {
  return (
    <Section name="Nickname">

    </Section>
  );
};

const ID = (props) => {
  return (
    <Section name="ID">

    </Section>
  );
};

const Password = (props) => {
  return (
    <Section name="Password">

    </Section>
  );
};

const Result = (props) => {
  return (
    <Section name="Result">

    </Section>
  );
};
