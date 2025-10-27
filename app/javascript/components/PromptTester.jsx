import React from 'react';
import { PromptProvider } from '../context/PromptContext';
import PromptInput from './PromptInput';
import ComparisonGrid from './ComparisonGrid';

/**
 * PromptTester - Main application component
 * Orchestrates the prompt input, comparison grid, and state management
 */
export function PromptTester({ initialColumns = 2 }) {
  return (
    <PromptProvider>
      <div className="prompt-tester">
        <header className="prompt-tester-header">
          <h1 className="prompt-tester-title">Claude Prompt Tester</h1>
          <p className="prompt-tester-subtitle">
            Compare Claude model outputs side-by-side with different parameters
          </p>
        </header>

        <PromptInput />

        <ComparisonGrid initialColumns={initialColumns} />
      </div>
    </PromptProvider>
  );
}

export default PromptTester;
