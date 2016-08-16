import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "../confirm";
import classNames from "classNames";
import request from '../actions/request';
import { Col, Panel, Form, FormGroup, FormControl, HelpBlock, InputGroup, ControlLabel } from "react-bootstrap";

import Merger from "../merger";
import { Section, CardSection, Arrow } from "../components/section";

import { postUser } from '../actions/';

const contains = (text, range) => { // Contains check.
  const len = text.length;
  return range[0] <= len && len <= range[1];
}

const statics = {

  landing: {
    header: "Creator's License",
    label: "If you have this license,",
    descriptions: [
      "You can make a game to code",
      "You can provide it everyone",
      "Somebody will learn from your code",
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
      "Login ID should be more than 3 characters",
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
      "Password should be more than 6 characters",
      "You must keep it secret from anyone!",
    ],
    placeholder: '99Hack99er',
    range: [6, 99]
  },
  confirm: {
    title: "Confirm your login information",
    description: "Please take a note of phrase below. It is required to log in.",
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

class Register extends React.Component {
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
      showResult: false,
    }
    this.update = this.update.bind(this);
    this.post = this.post.bind(this);
    this.verify = this.verify.bind(this);
    this.confirm = this.confirm.bind(this);
    this.showResult = this.showResult.bind(this);
  }

  componentDidMount() {
    // Default LoginId value
    request.get('random')
    .query({ keys: 'login_id' })
    .then((value) => this.update({ login_id: value.body.login_id, used: false }));
  }

  update(value) {
    this.setState((previous) => {
      return {
        user: Object.assign(previous.user, value)
      }
    });
  }

  showResult() {
    this.setState({ showResult: true });
  }

  post() {
    const { dispatch } = this.props;

    this.setState({ response: null });

    return dispatch(postUser(this.state.user))
      .then((result) => this.setState({ response: result }))
      .catch((err) => this.setState({ response: err.response }));
  }

  verify(id) {
    return request.get('verify')
    .send({ login_id: id })
    .then((value) => this.update({ used: false }))
    .catch((err) => this.update({ used: true }));
  }

  confirm() {
    return this.refs.confirm.show();
  }

  render() {
    const user = this.state.user;
    const resultClass = classNames({ 'hidden': !this.state.showResult });
    return (
      <div style={this.props.containerStyle}>
        <Confirm ref="confirm" {...statics.confirm}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <ControlLabel>Login ID</ControlLabel>
              <FormControl readOnly value={user.login_id} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <InputGroup>
                <PasswordEye hide={user.hide} update={user.update} />
                <FormControl readOnly value={user.password} type={user.hide ? 'password' : 'text'} />
              </InputGroup>
            </FormGroup>
          </Form>
        </Confirm>
        <Landing {...statics.landing} {...user} update={this.update} />
        <Gender {...statics.gender } {...user} update={this.update} />
        <Nickname {...statics.nickname } {...user} update={this.update} />
        <Login
          user={user}
          update={this.update}
          verify={this.verify}
          post={this.post}
          confirm={this.confirm}
          showResult={this.showResult}
           />
        <Result
          className={resultClass}
          {...statics.result }
          {...user}
          response={this.state.response}
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Register);

class Landing extends React.Component {
  render() {
    const props = this.props;
    const list = props.descriptions.map((item) => (
      <p key={item}>
        <span className="fa fa-check-circle-o text-success" />
        <span> {item}</span>
      </p>
    ));

    return (
      <CardSection
        name="Landing"
        header={props.header}
        next="Gender"
        style={{ marginTop: -this.context.muiTheme.appBar.height }}>
        <div style={{ textAlign: 'center' }}>
          <h3>{props.label}</h3>
          {list}
        </div>
      </CardSection>
    );
  }
};
Landing.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
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
  const status = contains(props.nickname, props.range) ? 'success' : 'warning';
  return (
    <CardSection name="Nickname"
      header={props.header}
      next="Login"
      descriptions={props.descriptions}
      >
      <Form onSubmit={(e) => e.preventDefault()}>
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
  const moveNext = () => {
    scroller.scrollTo('Result', { smooth: true });
    props.post();
  }
  return (
    <CardSection name="Login"
      header="Login"
      next="Login"
      onMoveNext={() => {
        props.showResult();
        props.confirm().then(moveNext);
      }}
      descriptions={statics.login_id.descriptions.concat(statics.password.descriptions)}
      >
      <Form onSubmit={(e) => e.preventDefault()}>
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
    const con = contains(this.props.login_id, this.props.range);
    const used = this.props.used;
    const status =
    !con || used === null ? undefined:
    con && !used ? 'success' : 'error';
    const inputStyle = this.state.changed ? {} : { color: 'gray' };

    const hint = con && used ? (
      <HelpBlock>{this.props.hintWhenUsed}</HelpBlock>
    ) : null;
    const loading = con && used === null ? (
      <span className="fa fa-spinner fa-pulse" />
    ) : con && !used ? (
      <span className="fa fa-thumbs-o-up" />
    ) : (
      <span className="fa fa-hand-o-right" />
    );
    const onUpdate = (value) => {
      if (this.props.allowed.test(value) || !value) {
        this.props.update({ login_id: value, used: null });
        this.setState({ changed: true });

        if (contains(value, this.props.range)) {
          this.props.verify(value);
        }
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
    const status = contains(this.props.password, this.props.range) ? 'success' : 'error';
    const inputStyle = this.state.changed ? {} : { color: 'gray' };
    const onFocus = (target) => {
      if (!this.state.changed) {
        window.setTimeout(() => target.select(), 100);
      }
    }
    const onChange = (value) => {
      this.props.update({ password: value });
      this.setState({ changed: true });
    };

    return (
      <FormGroup bsSize="large" validationState={status}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <InputGroup>
          <PasswordEye hide={this.props.hide} update={this.props.update} />
          <FormControl
            placeholder={this.props.placeholder}
            type={this.props.hide ? 'password' : 'text'}
            value={this.props.password}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => onFocus(e.target)}
            style={inputStyle}
            />
        </InputGroup>
      </FormGroup>
    );
  }
}

const PasswordEye = (props) => {
  const className = classNames('fa', {
    'fa-eye': !props.hide,
    'fa-eye-slash': props.hide
  });
  return (
    <InputGroup.Addon>
      <span className={className} onClick={() => props.update({ hide: !props.hide })} />
    </InputGroup.Addon>
  );
};

const Result = (props) => {
  const result = props.response === undefined ? (
    <span />
  ) : !props.response ? (
    <span className="fa fa-spinner fa-pulse fa-10x fa-fw margin-bottom"></span>
  ) : props.response.status >= 400 ? (
    <Error {...props.response} />
  ) : (
    <div>
      <h1>License Created</h1>
      <a href="login" className="btn btn-primary btn-lg m-y-3">Login</a>
    </div>
  );
  return (
    <Section name="Result" className={props.className}>
      {result}
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
    Object.keys(props.body).splice(0, 5).map((key) => detail(key, props.body[key])) : null;

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
