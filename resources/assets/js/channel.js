import React from 'react'

import IframeEmbed from './iframe-embed';

class Channel extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <IframeEmbed type="project" token={this.props.params.projectToken} />
      </div>
    );
  }

}

export default Channel;
