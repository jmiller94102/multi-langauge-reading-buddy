import React from 'react';

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-child-2xl font-bold text-gray-900">Profile</h1>
      <div className="card">
        <p className="text-child-base text-gray-600">
          Customize your experience! This page will have user settings, pet customization, language
          preferences, and theme options.
        </p>
      </div>
    </div>
  );
};
