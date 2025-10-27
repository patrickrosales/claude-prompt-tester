import React from 'react';
import ModelSelector from './ModelSelector';

/**
 * ParameterControls - Controls for temperature, max tokens, and model selection
 */
export function ParameterControls({
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  disabled = false,
}) {
  return (
    <div className="parameter-controls">
      <ModelSelector
        value={model}
        onChange={onModelChange}
        disabled={disabled}
      />

      <div className="control-group">
        <label className="control-label">
          Temperature ({temperature.toFixed(2)})
        </label>
        <div className="temperature-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="temperature-slider"
            title="Controls randomness: 0 is deterministic, 1 is most creative"
          />
          <span className="temperature-value">{temperature.toFixed(2)}</span>
        </div>
        <small style={{ color: '#6c757d', marginTop: '0.25rem' }}>
          0 = Deterministic, 1 = Creative
        </small>
      </div>

      <div className="control-group">
        <label className="control-label">Max Tokens</label>
        <input
          type="number"
          min="1"
          max="4096"
          value={maxTokens}
          onChange={(e) => onMaxTokensChange(parseInt(e.target.value, 10))}
          disabled={disabled}
          className="max-tokens-input"
        />
        <small style={{ color: '#6c757d', marginTop: '0.25rem' }}>
          Max output length (1-4096)
        </small>
      </div>
    </div>
  );
}

export default ParameterControls;
