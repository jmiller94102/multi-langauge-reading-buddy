import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 animate-bounce">🎉 Dashboard</h1>
        <p className="text-2xl">Your virtual pet lives here!</p>
      </div>
    </div>
  );
};
