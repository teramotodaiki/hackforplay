import React, { PropTypes, Component } from 'react';

import { FlatButton, CardText, TextField } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';

import StageCard from './StageCard';
import PlugTable from './PlugTable';

export default class ModStageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedPlug, plugs } = this.props;
    return (
      <StageCard
        {...this.props}
        cardActions={selectedPlug && (
          <FlatButton
            label="CONNECT"
            primary={true}
            labelPosition="before"
            icon={<Power />}
            disabled={!!plugs.find((item) => item.id === selectedPlug.id)}
            onTouchTap={() => this.props.handleConnect(this.props.stage)}
          />
        )}
        cardText={plugs.length ? (
          <CardText expandable={true}>
          <PlugTable plugs={plugs} />
          </CardText>
        ) : null}
      />
  );
  }
}

ModStageCard.propTypes = {
};
