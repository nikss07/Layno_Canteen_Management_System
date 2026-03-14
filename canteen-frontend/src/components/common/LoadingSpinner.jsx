import React from 'react';

export default function LoadingSpinner({ fullScreen = false, text = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}
