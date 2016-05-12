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
    header: "Type your nickname",
    description: "Should be more than 3 characters and less than 30 characters",
    range: [3, 30]
  },
  uID: {
    header: "Type your login ID",
    description: "You can use alphabet, numbers and underscore (_)",
    range: [3, 99],
    allowed: /\w+/,
    hintWhenUsed: "This ID has already used by someone, you can't use this"
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
  const len = props.nickname.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const status = contains ? 'success' : 'warning';
  return (
    <Section name="Nickname">
      <h1>{props.header}</h1>
      <InputGroup
        status={status}
        description={props.description}
        value={props.nickname}
        updateValue={(value) => props.update({ nickname: value })}
        />
      <Arrow to="UID" />
    </Section>
  );
};

const UID = (props) => {
  const len = props.uID.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const used = false; // Check in Server
  const status = contains && !used ? 'success' : 'danger';
  const hint = classNames('text-danger', {
    'collapse': !used
  });
  return (
    <Section name="UID">
      <h1>{props.header}</h1>
      <InputGroup
        status={status}
        description={props.description}
        value={props.uID}
        updateValue={(value) => props.update({ uID: value })}
        />
        <p className={hint}>{props.hintWhenUsed}</p>
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

const InputGroup = (props) => {
  const group = classNames('form-group', `has-${props.status}`);
  const input = classNames('form-control', 'form-control-lg', `form-control-${props.status}`);
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-lg-6 col-lg-offset-3">
          <div className={group}>
            <label className="form-control-label">{props.description}</label>
            <input
              type="text"
              className={input}
              value={props.value}
              onChange={(e) => props.updateValue(e.target.value)} />
          </div>
          {props.children}
        </div>
      </div>
    </div>
  )
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
