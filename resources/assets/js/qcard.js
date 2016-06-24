import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateQcard, pullQcard, pushQcard, createBell, postChat } from './actions/';

class Qcard extends Component {
  constructor(props) {
    super(props);

    const { dispatch, params: { id }, qcards: { local } } = this.props;
    if (!local[id]) {
      dispatch(pullQcard(id));
    }

    this.updateArticle = this.updateArticle.bind(this);


    setInterval(() => {
      let { dispatch, params: { id }, qcards: { local } } = this.props;
      if (local[id]) {
        dispatch(pushQcard(id));
      }
    }, 3000);

  }

  updateArticle(article) {
    const { params: { id }, qcards: { local }, dispatch } = this.props;

    const qcard = {
      id,
      article : Object.assign({}, local[id].article, article)
    }

    dispatch(updateQcard(qcard));
  }

  createBellWithQcard() {
    const { params: { id }, dispatch, qcards: { local } } = this.props;
    const team = 'hackit';
    const channel = local[id].channel_id;

    dispatch(updateQcard({ id, is_active: false }));
    dispatch(pushQcard(id))
    .then((result) => {
      return dispatch(createBell({
        team,
        channel,
        qcard: id,
      }));
    })
    .then((result) => {
      return dispatch(postChat(channel, {
        message: `🔔🎵 ...${team}'s bell rang`
      }));
    });
  }

  render() {
    const { params: { id }, qcards: { local } } = this.props;
    const qcard = local[id];
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
      <button
        type="button"
        onClick={() => this.createBellWithQcard()}>
        Submit
      </button>
    </div>);
  }
}

Qcard.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Qcard);
