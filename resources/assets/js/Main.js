import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './components/header';

const muiTheme = getMuiTheme(baseTheme);

var _isDrawerOpened = false;

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.onToggleDrawer = this.onToggleDrawer.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: muiTheme
    };
  }

  onToggleDrawer(isOpened) {
    _isDrawerOpened = isOpened;
    this.forceUpdate();
  }

  render() {

    const drawerWidth = _isDrawerOpened ? muiTheme.drawer.width : 0;

    const containerStyle = {
      width: window.innerWidth - drawerWidth,
      marginLeft: drawerWidth,
    };

    return (
      <MuiThemeProvider>
        <div>
          <Header onToggleDrawer={this.onToggleDrawer} />
          <div style={Object.assign({}, containerStyle)}>
            {this.props.children && React.cloneElement(this.props.children, {
              containerStyle
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
