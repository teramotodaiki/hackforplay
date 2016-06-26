import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import ChannelCard from './components/channel-card';
import { fetchChannels } from './actions/';

class ChannelList extends Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    this.state = {
      nextPage: 1,
      isLoading: false,
    };

    this.fetchNextPage();

  }

  fetchNextPage() {
    const { dispatch } = this.props;
    const { nextPage, isLoading } = this.state;

    if (isLoading) return
    else if (nextPage) {
      this.setState({ isLoading: true });
    }

    return nextPage ? dispatch(
      fetchChannels({ page: nextPage })
    ).then(({
      body: { current_page, last_page }
    }) => {
      this.setState({ nextPage: current_page < last_page ? current_page + 1 : null });
      this.setState({ isLoading: false });
    }) :
    Promise.resolve();

  }

  render() {

    const { channels } = this.props;
    const { nextPage, isLoading } = this.state;

    const sorted = Object.keys(channels)
    .map((key) => channels[key])
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

    return (<div>
      {sorted}
      {next}
    </div>);
  }
}

ChannelList.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelList);
