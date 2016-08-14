import React, { PropTypes, Component } from 'react';

import { FlatButton } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';

import StageCard from './StageCard';

export default class ModStageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cardActions = this.props.selectedPlugId && (
      <FlatButton
        label="CONNECT"
        primary={true}
        labelPosition="before"
        icon={<Power />}
      />
    );
    return (<StageCard {...this.props} cardActions={cardActions} />);
  }
}

ModStageCard.propTypes = {
};
