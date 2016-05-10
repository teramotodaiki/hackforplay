import React from 'react';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "./confirm";

import Merger from "./merger";
import { Section } from "./section";

const statics = {

  landing: {
    header: "Creator's License",
    description: ""
  },
  gender: {
    header: "Choose your icon",
    description: ""
  },
  nickname: {
    header: "Nickname",
    description: ""
  },
  uID: {
    header: "ID",
    description: ""
  },
  password: {
    header: "Password",
    description: ""
  },
  result: {
    header: "",
    description: ""
  }

};

export default class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Landing {...statics.landing} />
        <Gender {...statics.gender } />
        <Nickname {...statics.nickname } />
        <UID {...statics.uID } />
        <Password {...statics.password } />
        <Result {...statics.result } />
      </div>
    );
  }
}

const Landing = (props) => {
  return (
    <Section name="Landing">
      <h1>{props.header}</h1>
      <Arrow to="Gender" />
    </Section>
  );
};

const Gender = (props) => {
  return (
    <Section name="Gender">
      <h1>{props.header}</h1>
      <Arrow to="Nickname" />
    </Section>
  );
};

const Nickname = (props) => {
  return (
    <Section name="Nickname">
      <h1>{props.header}</h1>
      <Arrow to="UID" />
    </Section>
  );
};

const UID = (props) => {
  return (
    <Section name="UID">
      <h1>{props.header}</h1>
      <Arrow to="Password" />
    </Section>
  );
};

const Password = (props) => {
  return (
    <Section name="Password">
      <h1>{props.header}</h1>
      <Arrow to="Result" />
    </Section>
  );
};

const Result = (props) => {
  return (
    <Section name="Result">
      <h1>{props.header}</h1>
    </Section>
  );
};

const Arrow = (props) => {
  return (
    <ScrollLink to={props.to} smooth={true}>
      <span className="btn btn-lg">
        <span className="fa fa-arrow-down fa-2x"></span>
      </span>
    </ScrollLink>
  )
};
