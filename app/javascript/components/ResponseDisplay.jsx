import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * ResponseDisplay - Shows the model response with loading and error states
 */
export function ResponseDisplay({
  response,
  isLoading,
  error,
  executedAt,
  onClear,
}) {
  if (isLoading) {
    return (
      <div className="response-display empty">
        <LoadingSpinner message="Generating response..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="response-display empty">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response-display empty">
        <span>Ready to compare... Click Run to generate a response</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="response-display">{response}</div>
      {executedAt && (
        <div className="response-metadata">
          <span className="executed-at">Executed: {executedAt}</span>
          <button
            onClick={onClear}
            className="btn-secondary btn-sm"
            title="Clear this response"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default ResponseDisplay;
