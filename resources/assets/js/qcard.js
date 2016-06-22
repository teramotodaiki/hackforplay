import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchQcard } from './actions/';

class Qcard extends Component {
  constructor(props) {
    super(props);

    const { dispatch, params } = this.props;
    dispatch(fetchQcard({ id: params.id }));
  }

  render() {
    const id = +this.props.params.id;
    const qcard = this.props.qcards[id];
    const article = Object.assign({
      left: '',
      right: '',
    }, qcard ? qcard.article : null);

    return (<div>
      <textarea
        value={article.left}>
      </textarea>
      <textarea
        value={article.right}}>
      </textarea>
    </div>);
  }
}

Qcard.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Qcard);
