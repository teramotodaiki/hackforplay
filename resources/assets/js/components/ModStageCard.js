import React, { PropTypes, Component } from 'react';

import { FlatButton, CardText, TextField } from 'material-ui';
import Power from 'material-ui/svg-icons/notification/power';

import StageCard from './StageCard';

export default class ModStageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedPlugId, plugs } = this.props;
    return (
      <StageCard
        {...this.props}
        cardActions={selectedPlugId && (
          <FlatButton
            label="CONNECT"
            primary={true}
            labelPosition="before"
            icon={<Power />}
            disabled={!!plugs.find((item) => item.id == selectedPlugId)}
          />
        )}
        cardText={plugs.length ? (
          <CardText expandable={true}>
            {plugs.map((plug) => (
              <TextField
                key={plug.id}
                value={`require('${plug.full_label}')`}
                onTouchTap={({target}) => target.select(0, target.value.length - 1)}
              />
            ))}
          </CardText>
        ) : null}
      />
  );
  }
}

ModStageCard.propTypes = {
};
