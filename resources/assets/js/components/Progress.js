import React from 'react';

import { CircularProgress } from 'material-ui';

export default ({containerStyle}) => {

  const progressSize = Math.min(containerStyle.width, containerStyle.minHeight) / 200 >> 0;
  const progressStyle = {
    marginLeft: (containerStyle.width - 50) / 2 - 55,
    marginTop: (containerStyle.minHeight - 50) / 2,
  };

  return (
    <CircularProgress size={progressSize} style={progressStyle} />
  );
};
