import React from 'react';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "./confirm";
import classNames from "classNames";
import request from "./promised-xhr.js";

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
  loginID: {
    header: "Type your login ID",
    description: "You can use alphabet, numbers and underscore (_)",
    range: [3, 99],
    allowed: /\w+/,
    hintWhenUsed: "This ID has already used by someone, you can't use this"
  },
  password: {
    header: "Set login password",
    description: "You must keep it secret from anyone! (at least 6 length)",
    range: [6, 99]
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
        loginID: '11111111', // Account.Email
        password: '', // Account.Hashed
        hide: false, // Hide Password
      },
      response: null, // status, header, body (null is loading)
    }
    this.update = this.update.bind(this);
    this.post = this.post.bind(this);
  }

  update(value) {
    this.setState((previous) => {
      return {
        user: Object.assign(previous.user, value)
      }
    });
  }

  post() {
    this.setState({ response: null });
    const setter = (value) => this.setState({ response: value });

    return request.post('users', {
      data: this.state.user
    })
    .then(setter, setter);
  }

  render() {
    return (
      <div>
        <Landing {...statics.landing} {...this.state.user} update={this.update} />
        <Gender {...statics.gender } {...this.state.user} update={this.update} />
        <Nickname {...statics.nickname } {...this.state.user} update={this.update} />
        <LoginID {...statics.loginID } {...this.state.user} update={this.update} />
        <Password {...statics.password } {...this.state.user} update={this.update} post={this.post} />
        <Result {...statics.result } {...this.state.user} response={this.state.response} />
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
      <Arrow to="LoginID" />
    </Section>
  );
};

const LoginID = (props) => {
  const len = props.loginID.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const used = false; // Check in Server
  const status = contains && !used ? 'success' : 'danger';
  const hint = classNames('text-danger', {
    'collapse': !used
  });
  return (
    <Section name="LoginID">
      <h1>{props.header}</h1>
      <InputGroup
        status={status}
        description={props.description}
        value={props.loginID}
        updateValue={(value) => props.update({ loginID: value })}
        />
        <p className={hint}>{props.hintWhenUsed}</p>
      <Arrow to="Password" />
    </Section>
  );
};

const Password = (props) => {
  const len = props.password.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const status = contains ? 'success' : 'danger';
  const hide = (
    <span
      className={'fa fa-eye' + (props.hide ? '-slash' : '')}
      onClick={() => props.update({ hide: !props.hide })}
       />
  );
  return (
    <Section name="Password">
      <h1>{props.header}</h1>
      <InputGroup
        status={status}
        description={props.description}
        value={props.password}
        updateValue={(value) => props.update({ password: value })}
        left={hide}
        type={props.hide ? 'password' : 'text'}
        />
      <Arrow to="Result" onClick={() => props.post()} />
    </Section>
  );
};

const Result = (props) => {
  const h2 = (obj, key) => <h2 className="text-danger" key={key}>{obj[key]}</h2>;
  const result = !props.response ? (
    <div>
      <span className="fa fa-spinner fa-pulse fa-10x fa-fw margin-bottom"></span>
    </div>
  ) : (
    <div>
      <h1>{props.response.status}</h1>
      {Object.keys(props.response.body).map((key) => h2(props.response.body, key))}
    </div>
  );
  return (
    <Section name="Result">
      {result}
    </Section>
  );
};

const InputGroup = (props) => {
  const groupClass = classNames('form-group', `has-${props.status}`);
  const left = props.left ? (<div className="input-group-addon">{props.left}</div>) : null;
  const right = props.right ? (<div className="input-group-addon">{props.right}</div>) : null;
  const inputClass = classNames('form-control', `form-control-${props.status}`, {
    'form-control-lg': !(left || right)
  });
  const input = (
    <input
      type={props.type || 'text'}
      className={inputClass}
      value={props.value}
      placeholder={props.description}
      onChange={(e) => props.updateValue(e.target.value)}
      />
  );
  const line = (left || right) ? (
    <div className="input-group input-group-lg">
      {left}
      {input}
      {right}
    </div>
  ) : input;
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-lg-6 col-lg-offset-3">
          <div className={groupClass}>
            {line}
          </div>
          {props.children}
        </div>
      </div>
    </div>
  )
};

const Arrow = (props) => {
  return (
    <ScrollLink to={props.to} smooth={true} onClick={props.onClick}>
      <span className="btn btn-lg">
        <span className="fa fa-arrow-down fa-2x"></span>
      </span>
    </ScrollLink>
  )
};
