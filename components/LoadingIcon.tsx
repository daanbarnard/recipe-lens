import React from 'react';

const LoadingIcon: React.FC = () => {
  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div className="loading-bar-progress"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingIcon;