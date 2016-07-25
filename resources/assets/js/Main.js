import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './components/header';

const muiTheme = getMuiTheme(baseTheme);

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerStyle: {
        width: window.innerWidth,
        marginLeft: 0,
      }
    };

    this.onToggleDrawer = this.onToggleDrawer.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: muiTheme,
      containerStyle: this.state.containerStyle
    };
  }

  onToggleDrawer(isOpened) {
    const drawerWidth = isOpened ? muiTheme.drawer.width : 0;
    this.setState({
      containerStyle: Object.assign(this.state.containerStyle, {
        width: window.innerWidth - drawerWidth,
        marginLeft: drawerWidth,
      })
    });
  }

  render() {

    return (
      <MuiThemeProvider>
        <div>
          <Header onToggleDrawer={this.onToggleDrawer} />
          <div style={Object.assign({}, this.state.containerStyle)}>
            {this.props.children}
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
  containerStyle: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Main);
