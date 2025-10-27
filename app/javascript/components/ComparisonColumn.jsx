import React, { useCallback } from 'react';
import { usePrompt } from '../context/PromptContext';
import { usePromptComparison } from '../hooks/usePromptComparison';
import ParameterControls from './ParameterControls';
import ResponseDisplay from './ResponseDisplay';

/**
 * ComparisonColumn - A single column in the comparison grid
 * Represents one model configuration and its execution
 */
export function ComparisonColumn({ columnId = 1 }) {
  const { prompt } = usePrompt();
  const {
    response,
    isLoading,
    error,
    executedAt,
    model,
    temperature,
    maxTokens,
    executePrompt,
    clearResponse,
    resetParameters,
    setModel,
    setTemperature,
    setMaxTokens,
  } = usePromptComparison();

  const handleRun = useCallback(() => {
    executePrompt(prompt);
  }, [executePrompt, prompt]);

  return (
    <div className="comparison-column">
      <div className="column-header">
        <h3 className="column-title">Comparison {columnId}</h3>
        <ParameterControls
          model={model}
          onModelChange={setModel}
          temperature={temperature}
          onTemperatureChange={setTemperature}
          maxTokens={maxTokens}
          onMaxTokensChange={setMaxTokens}
          disabled={isLoading}
        />
      </div>

      <div className="column-body">
        <ResponseDisplay
          response={response}
          isLoading={isLoading}
          error={error}
          executedAt={executedAt}
          onClear={clearResponse}
        />

        <div className="button-group">
          <button
            onClick={handleRun}
            disabled={isLoading || !prompt.trim()}
            className="btn-primary"
            title="Execute prompt with current settings"
          >
            {isLoading ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={resetParameters}
            disabled={isLoading}
            className="btn-secondary"
            title="Reset all parameters to defaults"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComparisonColumn;
