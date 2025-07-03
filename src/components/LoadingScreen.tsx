import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div id="loading">
      <h2>Booting...</h2>
      <div id="loading-bar">
        <div id="loading-bar-progress"></div>
      </div>
      <div id="loading-items">Starting...</div>
    </div>
  );
};

export default LoadingScreen;
