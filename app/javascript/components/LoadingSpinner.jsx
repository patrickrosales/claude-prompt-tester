import React from 'react';

/**
 * LoadingSpinner - Displays an animated loading indicator
 */
export function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner-animation"></div>
      <span>{message}</span>
    </div>
  );
}

export default LoadingSpinner;
