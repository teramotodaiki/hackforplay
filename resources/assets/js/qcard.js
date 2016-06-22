import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchQcard, updateQcard } from './actions/';

class Qcard extends Component {
  constructor(props) {
    super(props);

    const { dispatch, params } = this.props;
    dispatch(fetchQcard({ id: params.id }));

    this.updateArticle = this.updateArticle.bind(this);
  }

  updateArticle(article) {
    const { params: { id }, qcards, dispatch } = this.props;

    const qcard = Object.assign({}, qcards[id], {
      article: Object.assign({}, qcards[id].article, article)
    });

    dispatch(updateQcard(qcard));
  }

  render() {
    const id = +this.props.params.id;
    const qcard = this.props.qcards[id];
    const article = Object.assign({
      left: '',
      right: '',
      checkedLeft: true,
      checkedRight: false,
    }, qcard ? qcard.article : null);

    return (<div>
      <p>HackforPlay Question Card</p>
      <textarea
        value={article.left}
        onChange={({ target }) => this.updateArticle({ left: target.value })}>
      </textarea>
      <input
        type="checkbox"
        checked={article.checkedLeft}
        onChange={() => this.updateArticle({ checkedLeft: !article.checkedLeft })} />
      then
      <textarea
        value={article.right}
        onChange={({ target }) => this.updateArticle({ right: target.value })}>
      </textarea>
      <input
        type="checkbox"
        checked={article.checkedRight}
        onChange={() => this.updateArticle({ checkedRight: !article.checkedRight })} />
      <button type="button">Submit</button>
    </div>);
  }
}

Qcard.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Qcard);
