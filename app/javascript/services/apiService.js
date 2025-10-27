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
  model = 'claude-sonnet-4-5-20250929',
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
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5 (Latest)' },
      { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Legacy)' },
    ];
  }
}

export default {
  callClaudeAPI,
  fetchAvailableModels,
};
