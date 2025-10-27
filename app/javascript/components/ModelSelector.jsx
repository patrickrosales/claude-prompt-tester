import React, { useState, useEffect } from 'react';
import { fetchAvailableModels } from '../services/apiService';

/**
 * ModelSelector - Dropdown for selecting Claude models
 */
export function ModelSelector({ value, onChange, disabled = false }) {
  const [models, setModels] = useState([
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5 (Latest)' },
    { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Legacy)' },
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
