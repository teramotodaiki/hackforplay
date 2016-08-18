import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import ChannelCard from '../components/channel-card';
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
      isLoading: false,
    };

  }

  componentDidMount() {
    const { channels } = this.props;

    if (Object.keys(channels).length < 15) {
      this.fetchNextPage();
    }
  }

  fetchNextPage() {
    const { dispatch } = this.props;
    const { nextPage, isLoading } = this.state;

    if (isLoading) return
    else if (nextPage) {
      this.setState({ isLoading: true });
    }

    return nextPage ? dispatch(
      fetchChannels({ page: nextPage, is_private: false })
    ).then(({
      body: { current_page, last_page, data }
    }) => {
      this.setState({ nextPage: current_page < last_page ? current_page + 1 : null });
      this.setState({ isLoading: false });
      data.forEach((item) => dispatch(fetchUserIfNeeded(item.user_id)));
    }) :
    Promise.resolve();

  }

  render() {

    const { dispatch, channels, containerStyle } = this.props;
    const { nextPage, isLoading } = this.state;

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

    const next = nextPage ? (
      <Button
        bsStyle="info"
        onClick={() => this.fetchNextPage()}
        disabled={isLoading}
        >
        more
      </Button>
    ) : null;

    return (
      <div style={this.props.containerStyle}>
        <div style={divStyle}>
          {sorted}
        </div>
        {next}
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
