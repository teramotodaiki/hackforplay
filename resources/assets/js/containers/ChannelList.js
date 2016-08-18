import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import ChannelCard from '../components/channel-card';
import LoadMore from '../components/LoadMore';
import {
  fetchChannels,
  fetchUserIfNeeded, getUserFromLocal,
} from '../actions/';

class ChannelList extends Component {
  constructor(props) {
    super(props);

    const { dispatch, channels } = this.props;

    this.state = {
      nextPage: 1,
    };

    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  fetchNextPage() {
    const { dispatch } = this.props;
    const { nextPage } = this.state;

    if (!nextPage) return;

    return nextPage ?
    dispatch(fetchChannels({ page: nextPage, is_private: false }))
    .then((result) => {
      const { body: {current_page, last_page, data} } = result;
      this.setState({ nextPage: current_page < last_page ? current_page + 1 : null });
      data.forEach((item) => dispatch(fetchUserIfNeeded(item.user_id)));
      return result;
    }) :
    Promise.resolve();

  }

  render() {

    const { dispatch, channels, containerStyle } = this.props;
    const { nextPage } = this.state;

    const divStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    };

    const sorted = Object.keys(channels)
    .map((key) => channels[key])
    .filter((channel) => !+channel.is_private)
    .sort((a, b) => {
      return (
        a.updated_at == null ? 1 :
        b.updated_at == null ? -1 :
        a.updated_at < b.updated_at ? 1 : -1
      );
    })
    .map((channel) => (
      <ChannelCard
        key={channel.ID}
        channel={channel}
        user={dispatch(getUserFromLocal(channel.user_id))}
      />));

    return (
      <div style={this.props.containerStyle}>
        <div style={divStyle}>
          {sorted}
        </div>
        {nextPage && (
          <LoadMore
            handleLoad={this.fetchNextPage}
            size={5}
            first={nextPage === 1}
          />
        )}
      </div>
    );
  }
}

ChannelList.propTypes = {
};

ChannelList.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelList);
