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
    const theme = getMuiTheme(baseTheme);
    const mergin = 20;

    const style = {
      height: window.innerHeight - theme.appBar.height - mergin * 2,
      width: Math.max(200, (window.innerWidth - theme.drawer.width - mergin * 4) / 2),
      margin: mergin,
      textAlign: 'center',
      display: 'inline-block',
    };

    return (
      <MuiThemeProvider>
        <div>
          <Header title="News" openImmediately={true} />
          <div style={{
            width: window.innerWidth - theme.drawer.width,
            marginLeft: theme.drawer.width,
          }}>
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
            <Paper style={style} zDepth={1}>
              <div
                className="fb-page"
                data-href="https://www.facebook.com/hackforplay/"
                data-tabs="timeline"
                data-width={style.width}
                data-height={style.height}
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true">
                <div className="fb-xfbml-parse-ignore">
                  <blockquote cite="https://www.facebook.com/hackforplay/">
                    <a href="https://www.facebook.com/hackforplay/">HackforPlay</a>
                  </blockquote>
                </div>
              </div>
            </Paper>
          </div>
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
