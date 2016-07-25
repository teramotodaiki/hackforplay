import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Paper } from 'material-ui';

export default class News extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (window.twttr) {
      twttr.widgets.load();
    }
  }

  render() {

    const style = {
      height: window.innerHeight - this.context.muiTheme.appBar.height,
      width: Math.min(520, window.innerWidth),
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
    };

    return (
      <div style={this.props.containerStyle}>
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
    );
  }
}

News.propTypes = {
};

News.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(News);
