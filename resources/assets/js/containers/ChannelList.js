import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import ChannelCard from '../components/channel-card';
import { fetchChannels } from '../actions/';

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
      body: { current_page, last_page }
    }) => {
      this.setState({ nextPage: current_page < last_page ? current_page + 1 : null });
      this.setState({ isLoading: false });
    }) :
    Promise.resolve();

  }

  render() {

    const { channels, containerStyle } = this.props;
    const { nextPage, isLoading } = this.state;

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
    .map((channel) => {
      return <ChannelCard key={channel.ID} {...channel}></ChannelCard>;
    });

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
      <div>
        {sorted}
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
