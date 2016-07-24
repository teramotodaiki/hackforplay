import React from 'react';
import { Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';

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

  const mypage = user && 'id' in user ? `/m?id=${user.ID}` : '';
  const nickname = user && 'nickname' in user ? user.Nickname : '';

  return (
    <Col xs={6} sm={4} md={3}>
      <Panel>
        <div style={thumbnailStyle}></div>
        <p style={fixedHeight(1)}>
          Owner: <a href={mypage}>{nickname}</a>
        </p>
        <p style={fixedHeight(2)} >{description}</p>
        <Link to={`/channels/${ID}/watch`}>
          <Button bsStyle="primary">watch</Button>
        </Link>
      </Panel>
    </Col>
  );
}
