import React from 'react';

import { Col, Panel, Button } from 'react-bootstrap';

export default ({ ID, Thumbnail, user, description }) => {

  const thumbnailStyle = {
    background: `url(${Thumbnail}) center center`,
    backgroundSize: 'cover',
    height: '12rem',
  };
  const lineHeight = 1.428571429;
  const fixedHeight = (rem) => {
    return {
      height: (rem * lineHeight) + 'rem',
      overflowY: 'scroll',
    };
  };

  return (
    <Col xs={6} sm={4} md={3}>
      <Panel>
        <div style={thumbnailStyle}></div>
        <p style={fixedHeight(1)}>
          Owner: <a href={`/m?id=${user.ID}`}>{user.Nickname}</a>
        </p>
        <p style={fixedHeight(2)} >{description}</p>
        <Button bsStyle="primary" href={`/channels/${ID}/watch`}>watch</Button>
      </Panel>
    </Col>
  );
}
