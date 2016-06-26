import React from 'react';

import { Col, Thumbnail, Button } from 'react-bootstrap';

export default (props) => {

  const { ID, user, description } = props;
  const thumbnail = props.Thumbnail;

  return (
    <Col xs={6} sm={4} md={3} lg={2}>
      <Thumbnail src={thumbnail} >
        <p>Owner: <a href={`/m?id=${user.ID}`}>{user.Nickname}</a></p>
        <p>{description}</p>
        <Button bsStyle="primary" href={`/channels/${ID}/watch`}>watch</Button>
      </Thumbnail>
    </Col>
  );
}
