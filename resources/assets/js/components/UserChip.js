import React, { PropTypes, Component } from 'react';

import { Chip, Avatar } from 'material-ui';
import AssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import Face from 'material-ui/svg-icons/action/face';

export default class UserChip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user, isOwner } = this.props;
    const { palette } = this.context.muiTheme;

    return (
      <Chip
        style={{ display: 'inline-block' }}
        labelStyle={{ verticalAlign: 'bottom' }}
        onTouchTap={() => location.href = '/m?id=' + user.id}
        >
        {isOwner ? (
          <Avatar icon={<AssignmentInd />} />
        ) : (
          <Avatar icon={<Face />} />
        )}
        {user.nickname}
      </Chip>
    );
  }
}

UserChip.propTypes = {
  user: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

UserChip.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
