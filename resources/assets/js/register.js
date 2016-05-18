import React from 'react';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "./confirm";
import classNames from "classNames";
import request from "./promised-xhr.js";
import { Col, Panel, Form, FormGroup, FormControl, HelpBlock, InputGroup, ControlLabel } from "react-bootstrap";

import Merger from "./merger";
import { Section } from "./section";

const statics = {

  landing: {
    header: "Creator's License",
    descriptions: [
      "You can make a game after get this license",
      "It's free",
    ]
  },
  gender: {
    header: "Icon",
    label: "Choose your icon",
    descriptions: [(<span><span className="fa fa-mouse-pointer"></span>Click to select</span>)],
    male: "m/icon_m.png",
    female: "m/icon_w.png"
  },
  nickname: {
    header: "Nickname",
    label: "Type your nickname",
    descriptions: [
      "Should be more than 3 characters and less than 30 characters",
      "Don't use your real name. Save personal information by yourself :-)",
    ],
    placeholder: 'superhacker',
    range: [3, 30]
  },
  login_id: {
    header: "Login",
    label: "(ID) Remember this number or Change into your usual ID",
    descriptions: [
      "You can use alphabet, numbers and underscore (_)",
    ],
    placeholder: 'hacker9999',
    range: [3, 99],
    allowed: /^\w+$/,
    hintWhenUsed: "This ID has already used by someone, you can't use this"
  },
  password: {
    header: "Login",
    label: "(Password) Remember this number or Change into your usual password",
    descriptions: [
      "You must keep it secret from anyone!",
    ],
    placeholder: '99Hack99er',
    range: [6, 99]
  },
  result: {
    header: "",
    descriptions: []
  },

  component: {
    // column key => component.name
    gender: 'Gender',
    nickname: 'Nickname',
    login_id: 'Login',
    password: 'Login',
  },

};

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    const gen = (Math.random() * 900000 + 100000 >> 0) + '';
    this.state = {
      // Default User
      user: {
        gender: 'male',
        nickname: '',
        login_id: '', // Account.Email
        password: gen, // Account.Hashed
        hide: false, // Hide Password
        used: null, // login_idがすでに使われているか
      },
      response: undefined, // status, header, body (null is loading)
    }
    this.update = this.update.bind(this);
    this.post = this.post.bind(this);
    this.verify = this.verify.bind(this);

    // Default LoginId value
    request.get('random', {
      data: { keys: 'login_id' }
    })
    .then((value) => this.update({ login_id: value.body.login_id, used: false }));
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

  verify(id) {
    return request.get('verify', {
      data: { login_id: id }
    })
    .then((value) => this.update({ used: false }))
    .catch((err) => this.update({ used: true }));
  }

  render() {
    return (
      <div>
        <Landing {...statics.landing} {...this.state.user} update={this.update} />
        <Gender {...statics.gender } {...this.state.user} update={this.update} />
        <Nickname {...statics.nickname } {...this.state.user} update={this.update} />
        <Login
          user={this.state.user}
          update={this.update}
          verify={this.verify}
          post={this.post} />
        <Result {...statics.result } {...this.state.user} response={this.state.response} />
      </div>
    );
  }
}

const Landing = (props) => {

  const list = props.descriptions.map((item) => <li>{item}</li>);

  return (
    <CardSection name="Landing" header={props.header} next="Gender">
      <ul>{list}</ul>
    </CardSection>
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
    <CardSection name="Gender"
      header={props.header}
      next="Nickname"
      descriptions={props.descriptions}
      >
      <div style={{ textAlign: 'center' }}>
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
    </CardSection>
  );
};

const Nickname = (props) => {
  const len = props.nickname.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const status = contains ? 'success' : 'warning';
  return (
    <CardSection name="Nickname"
      header={props.header}
      next="Login"
      descriptions={props.descriptions}
      >
      <Form>
        <FormGroup bsSize="large" validationState={status}>
          <ControlLabel>{props.label}</ControlLabel>
          <FormControl
            placeholder={props.placeholder}
            value={props.nickname}
            onChange={(e) => props.update({ nickname: e.target.value })}
            />
        </FormGroup>
      </Form>
    </CardSection>
  );
};

const Login = (props) => {
  return (
    <CardSection name="Login"
      header="Login"
      next="Result"
      onMoveNext={() => props.post()}
      descriptions={statics.login_id.descriptions.concat(statics.password.descriptions)}
      >
      <Form>
        <LoginId {...statics.login_id} {...props.user} update={props.update} verify={props.verify} />
        <Password {...statics.password} {...props.user} update={props.update} />
      </Form>
    </CardSection>
  )
}

class LoginId extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changed: false
    };
  }

  render() {
    const len = this.props.login_id.length;
    const contains = this.props.range[0] <= len && len <= this.props.range[1];
    const used = this.props.used;
    const status =
    !contains || used === null ? undefined:
    contains && !used ? 'success' : 'error';
    const inputStyle = this.state.changed ? {} : { color: 'gray' };

    const hint = contains && used ? (
      <HelpBlock>{this.props.hintWhenUsed}</HelpBlock>
    ) : null;
    const loading = contains && used === null ? (
      <span className="fa fa-spinner fa-pulse" />
    ) : contains && !used ? (
      <span className="fa fa-thumbs-o-up" />
    ) : (
      <span className="fa fa-hand-o-right" />
    );
    const onUpdate = (value) => {
      if (this.props.allowed.test(value) || !value) {
        this.props.update({ login_id: value, used: null });
        if (contains) this.props.verify(value);
        this.setState({ changed: true });
      }
    };
    const onFocus = (target) => {
      if (!this.state.changed) {
        window.setTimeout(() => target.select(), 100);
      }
    }

    return (
      <FormGroup bsSize="large" validationState={status}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>{loading}</InputGroup.Addon>
          <FormControl
            placeholder={this.props.placeholder}
            value={this.props.login_id}
            onChange={(e) => onUpdate(e.target.value)}
            onFocus={(e) => onFocus(e.target)}
            style={inputStyle}
            />
        </InputGroup>
        {hint}
      </FormGroup>
    );
  }
}

class Password extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changed: false
    };
  }

  render() {
    const len = this.props.password.length;
    const contains = this.props.range[0] <= len && len <= this.props.range[1];
    const status = contains ? 'success' : 'error';
    const hide = (
      <span
        className={'fa fa-eye' + (this.props.hide ? '-slash' : '')}
        onClick={() => this.props.update({ hide: !this.props.hide })}
         />
    );
    const inputStyle = this.state.changed ? {} : { color: 'gray' };
    const onFocus = (target) => {
      if (!this.state.changed) {
        window.setTimeout(() => target.select(), 100);
      }
    }

    return (
      <FormGroup bsSize="large" validationState={status}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>{hide}</InputGroup.Addon>
          <FormControl
            placeholder={this.props.placeholder}
            type={this.props.hide ? 'password' : 'text'}
            value={this.props.password}
            onChange={(e) => this.props.update({ password: e.target.value })}
            onFocus={(e) => onFocus(e.target)}
            style={inputStyle}
            />
        </InputGroup>
      </FormGroup>
    );
  }
}

const Result = (props) => {
  const collapse = classNames({ hidden: props.response === undefined });
  const result = !props.response ? (
    <div>
      <span className="fa fa-spinner fa-pulse fa-10x fa-fw margin-bottom"></span>
    </div>
  ) : props.response.status >= 400 ? (
    <Error {...props.response} />
  ) : (
    <div>
      <h1>License Created</h1>
      <a href="login" className="btn btn-primary btn-lg m-y-3">Login</a>
    </div>
  );
  return (
    <Section name="Result">
      <div className={collapse}>
        {result}
      </div>
    </Section>
  );
};

const Error = (props) => {
  console.error('Registration api is failed, see this response...', props.status, props.headers, props.body);
  const errorText =
    props.status <= 404 ? 'please try sending again' :
    props.status == 422 ? 'please check below and correct input' :
    'something went wrong. I tried to dump this error to your console...';
  const h2 = (key, value) => <h2 key={key}>{value}</h2>;
  const detail = (key, value) => {
    return h2(key, (
      <div>
        <span>{value}</span>
        <Arrow to={statics.component[key]} faClass="fa fa-arrow-up" />
      </div>
    ));
  };
  const details = typeof props.body === 'object' ?
    Object.keys(props.body).splice(0, 5).map((key) => detail(key, props.body[key])) :
    h2('error', props.body);

  return (
    <div>
      <h1>
        <span>Sorry, </span>
        <span className="text-danger">{errorText}</span>
      </h1>
      <div>
        {details}
      </div>
    </div>
  );
}

const CardSection = (props) => {

  const header = (
    <h1 style={{ textAlign: 'center' }}>{props.header}</h1>
  );
  const footer = props.descriptions ? (
    <ul>
      {props.descriptions.filter(i => i).map(i => <li key={i}>{i}</li>)}
    </ul>
  ) : null;
  const spacer = <div style={{ height: '1.5rem' }} />;

  return (
    <Section name={props.name} style={{ textAlign: 'left' }}>
      <div />
      <Col xs={11} sm={9} md={8} lg={7}>
        <Panel header={header} footer={footer}>
          {spacer}
          {props.children}
          {spacer}
        </Panel>
      </Col>
      <Arrow to={props.next} onClick={props.onMoveNext} />
    </Section>
  );
};

const Arrow = (props) => {
  const faClass = props.faClass || 'fa fa-arrow-down fa-2x';
  const addDefault = Object.assign({
    smooth: true
  }, props);
  return (
    <ScrollLink {...addDefault}>
      <span className="btn btn-lg">
        <span className={faClass}></span>
      </span>
    </ScrollLink>
  )
};
