import React from 'react';

const AvatarStack = ({ avatars = [] }) => {
  return (
    <div className="avatar-stack">
      {avatars.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`User ${idx + 1}`}
          className="avatar-image avatar-stack-item"
          style={{ width: '24px', height: '24px', borderWidth: '1px', marginLeft: idx > 0 ? '-8px' : '0' }}
        />
      ))}
    </div>
  );
};

export default AvatarStack;
