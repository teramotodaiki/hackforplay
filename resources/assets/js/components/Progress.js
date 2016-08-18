import React from 'react';

import { CircularProgress } from 'material-ui';

export default (props) => {

  return (
    <div style={{ textAlign: 'center' }}>
      <CircularProgress {...props} />
    </div>);
};
