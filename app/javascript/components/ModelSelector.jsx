import React, { useState, useEffect } from 'react';
import { fetchAvailableModels } from '../services/apiService';

/**
 * ModelSelector - Dropdown for selecting Claude models
 */
export function ModelSelector({ value, onChange, disabled = false }) {
  const [models, setModels] = useState([
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
    { id: 'claude-3-haiku-20250307', name: 'Claude 3 Haiku' },
  ]);

  useEffect(() => {
    // Optionally fetch models from backend if endpoint exists
    const loadModels = async () => {
      try {
        const availableModels = await fetchAvailableModels();
        setModels(availableModels);
      } catch (err) {
        // Use fallback models already set
        console.error('Failed to fetch models, using defaults:', err);
      }
    };

    loadModels();
  }, []);

  return (
    <div className="control-group">
      <label className="control-label">Model</label>
      <select
        className="model-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModelSelector;
