import React, { PropTypes, Component } from 'react';

import StageCard from './StageCard';

export default class ModStageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<StageCard {...this.props} />);
  }
}

ModStageCard.propTypes = {
};
