import { useState, useCallback, useRef } from 'react';
import { callClaudeAPI } from '../services/apiService';

/**
 * Custom hook for managing a single comparison column state
 * Handles loading, errors, and API calls for one model configuration
 */
export function usePromptComparison() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [executedAt, setExecutedAt] = useState(null);
  const [model, setModel] = useState('claude-3-5-sonnet-20241022');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const abortControllerRef = useRef(null);

  /**
   * Execute a prompt with current model and parameters
   */
  const executePrompt = useCallback(async (prompt) => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await callClaudeAPI({
        prompt,
        model,
        temperature,
        max_tokens: maxTokens,
      });

      setResponse(result.content);
      setExecutedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  }, [model, temperature, maxTokens]);

  /**
   * Clear the current response and reset state
   */
  const clearResponse = useCallback(() => {
    setResponse('');
    setError(null);
    setExecutedAt(null);
  }, []);

  /**
   * Reset all parameters to defaults
   */
  const resetParameters = useCallback(() => {
    setModel('claude-3-5-sonnet-20241022');
    setTemperature(0.7);
    setMaxTokens(1024);
    clearResponse();
  }, []);

  return {
    // State
    response,
    isLoading,
    error,
    executedAt,
    model,
    temperature,
    maxTokens,

    // Actions
    executePrompt,
    clearResponse,
    resetParameters,
    setModel,
    setTemperature,
    setMaxTokens,
  };
}
