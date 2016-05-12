import React from 'react';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "./confirm";
import classNames from "classNames";

import Merger from "./merger";
import { Section } from "./section";

const statics = {

  landing: {
    header: "Creator's License",
    description: ""
  },
  gender: {
    header: "Choose your icon",
    description: "",
    male: "m/icon_m.png",
    female: "m/icon_w.png"
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
    this.state = {
      // Default User
      user: {
        gender: 'male',
        nickname: '',
        uID: '11111111', // Account.Email
        password: '1111' // Account.Hashed
      }
    }
    this.update = this.update.bind(this);
  }

  update(value) {
    this.setState((previous) => {
      return {
        user: Object.assign(previous.user, value)
      }
    });
  }

  render() {
    return (
      <div>
        <Landing {...statics.landing} {...this.state.user} update={this.update} />
        <Gender {...statics.gender } {...this.state.user} update={this.update} />
        <Nickname {...statics.nickname } {...this.state.user} update={this.update} />
        <UID {...statics.uID } {...this.state.user} update={this.update} />
        <Password {...statics.password } {...this.state.user} update={this.update} />
        <Result {...statics.result } {...this.state.user} update={this.update} />
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
  const normal = {
    borderRadius: "50%",
    minWidth: "6rem",
    margin: "2rem",
    border: ".4rem solid transparent"
  };
  const active = Object.assign({}, normal, {
    border: ".4rem solid #66afe9"
  });
  return (
    <Section name="Gender">
      <h1>{props.header}</h1>
      <div>
        <img
          src={props.male}
          style={props.gender === 'male' ? active : normal}
          onClick={() => props.update({ gender: 'male' })}
          />
        <img
          src={props.female}
          style={props.gender === 'female' ? active : normal}
          onClick={() => props.update({ gender: 'female' })}
          />
      </div>
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
