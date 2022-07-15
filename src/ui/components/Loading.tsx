import React from 'react';

const Loading = () => {
  return (
    <main className="loading-page">
      <img src='./icons/parrot_48.png' alt="parrot" />
      <p>Loading...</p>
      <div className='loading-container'>
        <div className='loading-bar'></div>
      </div>

    </main>
  );
};

export default Loading;