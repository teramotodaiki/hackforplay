import React from 'react'

class Channel extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>Hey, {this.props.params.projectToken}</div>
    );
  }

}

export default Channel;
