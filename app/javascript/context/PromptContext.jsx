import React, { createContext, useState, useCallback } from 'react';

export const PromptContext = createContext();

/**
 * PromptProvider manages the shared prompt state across all comparison columns
 * This allows all columns to reference the same prompt without prop drilling
 */
export function PromptProvider({ children }) {
  const [prompt, setPrompt] = useState('');

  const updatePrompt = useCallback((newPrompt) => {
    setPrompt(newPrompt);
  }, []);

  const value = {
    prompt,
    updatePrompt,
  };

  return (
    <PromptContext.Provider value={value}>
      {children}
    </PromptContext.Provider>
  );
}

/**
 * Custom hook for consuming the prompt context
 */
export function usePrompt() {
  const context = React.useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
}
