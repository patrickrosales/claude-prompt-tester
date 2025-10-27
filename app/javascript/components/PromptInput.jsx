import React, { useCallback } from 'react';
import { usePrompt } from '../context/PromptContext';

/**
 * PromptInput - Shared textarea for entering the prompt to compare
 * Updates are propagated to all comparison columns via context
 */
export function PromptInput() {
  const { prompt, updatePrompt } = usePrompt();

  const handleChange = useCallback(
    (e) => {
      updatePrompt(e.target.value);
    },
    [updatePrompt]
  );

  return (
    <div className="prompt-input-section">
      <label htmlFor="prompt-textarea" className="prompt-input-label">
        Enter Your Prompt
      </label>
      <textarea
        id="prompt-textarea"
        className="prompt-input-textarea"
        placeholder="Enter the prompt you want to compare across different models and parameters..."
        value={prompt}
        onChange={handleChange}
      />
      <small style={{ color: '#6c757d', marginTop: '0.5rem', display: 'block' }}>
        This prompt will be sent to all comparison columns when you click Run
      </small>
    </div>
  );
}

export default PromptInput;
