import React from 'react';

export default ({ ID, Thumbnail, user, description }) => {

  return (
    <div>
      <img src={Thumbnail}></img>
      <p>{user.Nickname}</p>
      <p>{description}</p>
    </div>
  );
}
