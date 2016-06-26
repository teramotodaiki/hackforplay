import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { fetchChannels } from './actions/';

class ChannelList extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    dispatch(fetchChannels());

  }

  render() {

    const { channels } = this.props;

    const sorted = Object.keys(channels)
    .map((key) => channels[key])
    .sort((a, b) => {
      return a.updated_at > b.updated_at ? 1 : -1;
    })
    .map((channel) => {
      return (
        <div key={channel.ID}>
          <img src={channel.Thumbnail}></img>
          <p>{channel.user.Nickname}</p>
          <p>{channel.description}</p>
        </div>
      );
    });

    return (<div>
      {sorted}
      </div>);
  }
}

ChannelList.propTypes = {
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(ChannelList);
