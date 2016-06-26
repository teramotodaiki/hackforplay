import React from 'react';

import { Col } from 'react-bootstrap';

export default ({ ID, Thumbnail, user, description }) => {

  return (
    <Col xs={6} sm={4} md={3} lg={2} >
      <img src={Thumbnail}></img>
      <p>{user.Nickname}</p>
      <p>{description}</p>
    </Col>
  );
}
