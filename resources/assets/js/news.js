import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Paper } from 'material-ui';

import Header from './components/header';

export default class News extends Component {
  constructor(props) {
    super(props);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  render() {
    const style = {
      height: 600,
      width: 520,
      margin: 20,
      display: 'inline-block',
    };

    return (
      <MuiThemeProvider>
        <div>
          <Header title="News" />
          <Paper style={style} zDepth={1}>
            <a
              className="twitter-timeline"
              href="https://twitter.com/hashtag/hackforplay"
              data-widget-id="753485868157906944"
              width={style.width}
              height={style.height}>
              #hackforplay のツイート
            </a>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

News.propTypes = {
};

News.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(News);
