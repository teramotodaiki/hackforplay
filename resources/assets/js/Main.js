import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { getAuthUser } from './actions/';
import Header from './components/header';

const muiTheme = getMuiTheme(baseTheme);

var _isDrawerOpened = false;

export default class Main extends Component {
  constructor(props) {
    super(props);

    const meta = document.querySelector('meta[name="login-user-id"]');
    const userId = meta ? meta.getAttribute('content') : null;

    this.state = {
      authUser: { id: userId },
    };

    this.onToggleDrawer = this.onToggleDrawer.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: muiTheme
    };
  }

  onToggleDrawer(isOpened) {
    _isDrawerOpened = isOpened;
    setTimeout(() => this.forceUpdate(), 80);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    window.addEventListener('resize', () => this.forceUpdate());

    dispatch(getAuthUser())
    .then((user) => this.setState({ authUser: user }));
  }

  render() {

    const drawerWidth = _isDrawerOpened ? muiTheme.drawer.width : 0;

    const containerStyle = {
      width: window.innerWidth - drawerWidth,
      marginLeft: drawerWidth,
      marginTop: 15,
      minHeight: window.innerHeight - muiTheme.appBar.height,
    };

    return (
      <MuiThemeProvider>
        <div>
          <Header onToggleDrawer={this.onToggleDrawer} />
          <div>
            {this.props.children && React.cloneElement(this.props.children, {
              containerStyle,
              authUser: this.state.authUser,
            })}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Main.propTypes = {
};

Main.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Main);
