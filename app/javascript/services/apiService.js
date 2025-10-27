import axios from 'axios';

/**
 * API Service for communicating with the Rails backend
 * The backend handles actual Claude API calls for security
 */

const API_BASE_URL = '/api';

// Create axios instance with CSRF token
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
  },
});

/**
 * Call the Claude API through Rails backend
 * @param {string} prompt - The prompt to send
 * @param {object} params - API parameters
 * @param {string} params.model - Model to use (claude-3-5-sonnet, claude-3-opus, claude-3-haiku)
 * @param {number} params.temperature - Temperature (0.0 to 1.0)
 * @param {number} params.max_tokens - Maximum tokens to generate
 * @param {function} onStreamChunk - Optional callback for streaming chunks
 * @returns {Promise<object>} API response
 */
export async function callClaudeAPI({
  prompt,
  model = 'claude-3-5-sonnet-20241022',
  temperature = 0.7,
  max_tokens = 1024,
  onStreamChunk,
}) {
  try {
    const response = await axiosInstance.post('/prompts/compare', {
      prompt,
      model,
      temperature,
      max_tokens,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`API Error: ${errorMessage}`);
  }
}

/**
 * Fetch available Claude models
 * @returns {Promise<array>} List of available models
 */
export async function fetchAvailableModels() {
  try {
    const response = await axiosInstance.get('/models');
    return response.data.models;
  } catch (error) {
    // Fallback to known models if endpoint not available
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
      { id: 'claude-3-haiku-20250307', name: 'Claude 3 Haiku' },
    ];
  }
}

export default {
  callClaudeAPI,
  fetchAvailableModels,
};
