import React, { PropTypes, Component } from 'react';

import { FlatButton } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';

import StageCard from './StageCard';

export default class ModStageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedPlugId, plugs } = this.props;
    const cardActions = selectedPlugId && (
      <FlatButton
        label="CONNECT"
        primary={true}
        labelPosition="before"
        icon={<Power />}
        disabled={!!plugs.find((item) => item.id == selectedPlugId)}
      />
    );
    return (<StageCard {...this.props} cardActions={cardActions} />);
  }
}

ModStageCard.propTypes = {
};
