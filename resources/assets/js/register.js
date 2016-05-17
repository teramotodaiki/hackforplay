import React from 'react';
import { Link as ScrollLink, scroller } from "react-scroll";
import Confirm from "./confirm";
import classNames from "classNames";
import request from "./promised-xhr.js";
import { Panel, Form, FormGroup, FormControl, HelpBlock, InputGroup } from "react-bootstrap";

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
  login_id: {
    header: "Type your login ID",
    description: "You can use alphabet, numbers and underscore (_)",
    range: [3, 99],
    allowed: /^\w+$/,
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
          login_id={statics.login_id}
          password={statics.password}
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
      <Form>
        <FormGroup bsSize="large" validationState={status}>
          <FormControl
            value={props.nickname}
            onChange={(e) => props.update({ nickname: e.target.value })}
            />
          <HelpBlock>{props.description}</HelpBlock>
        </FormGroup>
      </Form>
      <Arrow to="Login" />
    </Section>
  );
};

const Login = (props) => {
  return (
    <Section name="Login">
      <LoginId {...props.login_id} {...props.user} update={props.update} verify={props.verify} />
      <Password {...props.password} {...props.user} update={props.update} />
      <Arrow to="Result" onClick={() => props.post()} />
    </Section>
  )
}

const LoginId = (props) => {
  const len = props.login_id.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const used = props.used;
  const status =
  !contains || used === null ? undefined:
  contains && !used ? 'success' : 'error';

  const hint = contains && used ? (
    <HelpBlock>{props.hintWhenUsed}</HelpBlock>
  ) : null;
  const loading = contains && used === null ? (
    <span className="fa fa-spinner fa-pulse" />
  ) : contains && !used ? (
    <span className="fa fa-thumbs-o-up" />
  ) : (
    <span className="fa fa-hand-o-right" />
  );
  const onUpdate = (value) => {
    if (props.allowed.test(value)) {
      props.update({ login_id: value, used: null });
      if (contains) props.verify(value);
    }
  };

  return (
    <div>
      <h1>{props.header}</h1>
      <Form>
        <FormGroup bsSize="large" validationState={status}>
          <InputGroup>
            <InputGroup.Addon>{loading}</InputGroup.Addon>
            <FormControl
              value={props.login_id}
              onChange={(e) => onUpdate(e.target.value)}
              />
          </InputGroup>
          <HelpBlock>{props.description}</HelpBlock>
          {hint}
        </FormGroup>
      </Form>
    </div>
  );
};

const Password = (props) => {
  const len = props.password.length;
  const contains = props.range[0] <= len && len <= props.range[1];
  const status = contains ? 'success' : 'error';
  const hide = (
    <span
      className={'fa fa-eye' + (props.hide ? '-slash' : '')}
      onClick={() => props.update({ hide: !props.hide })}
       />
  );
  return (
    <div>
      <h1>{props.header}</h1>
      <Form>
        <FormGroup bsSize="large" validationState={status}>
          <InputGroup>
            <InputGroup.Addon>{hide}</InputGroup.Addon>
            <FormControl
              type={props.hide ? 'password' : 'text'}
              value={props.password}
              onChange={(e) => props.update({ password: e.target.value })}
              />
          </InputGroup>
          <HelpBlock>{props.description}</HelpBlock>
        </FormGroup>
      </Form>
    </div>
  );
};

const Result = (props) => {
  const collapse = classNames({ collapse: props.response === undefined });
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
