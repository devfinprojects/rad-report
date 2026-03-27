/**
 * AI Client Module - AI API Integration
 * Part of RadReport AI Integration
 */

import { createCompletionRequest, buildPrompt } from './prompt-builder.js';

/**
 * Creates AI client for making API calls
 * @param {Object} config - AI configuration
 * @returns {Object} AI client
 */
export function createAIClient(config = {}) {
  const {
    endpoint = '',
    apiKey = '',
    model = 'default-model',
    timeout = 30000,
    maxRetries = 3
  } = config;

  /**
   * Makes a completion request
   * @param {Object} prompt - Prompt object
   * @returns {Object} Completion result
   */
  async function complete(prompt) {
    const request = createCompletionRequest(prompt, {
      model,
      timeout
    });

    // In a real implementation, this would make an HTTP request
    // For now, we'll simulate a response
    return simulateCompletion(prompt);
  }

  /**
   * Creates a streaming completion
   * @param {Object} prompt - Prompt object
   * @returns {AsyncGenerator} Stream of completions
   */
  async function* streamComplete(prompt) {
    const request = createCompletionRequest(prompt, {
      model,
      timeout,
      stream: true
    });

    // Simulate streaming response
    const text = await simulateCompletion(prompt);
    const words = text.split(' ');

    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Simulates completion for demo
   * @param {Object} prompt - Prompt object
   * @returns {string} Simulated response
   */
  async function simulateCompletion(prompt) {
    // Return a sample radiology response
    return generateRadiologyResponse(prompt);
  }

  /**
   * Generates a sample radiology response
   * @param {Object} prompt - Prompt object
   * @returns {string} Generated text
   */
  function generateRadiologyResponse(prompt) {
    const params = prompt.params || {};
    
    if (params.modality === 'CT' && params.bodyRegion === 'HEAD') {
      return `TECHNIQUE:
Axial CT images of the head were obtained without intravenous contrast.

FINDINGS:
Parenchyma: Gray-white matter differentiation is preserved. No focal areas of abnormal attenuation. No mass effect or midline shift.

Ventricular System: Ventricles are appropriate in size and configuration for age. No evidence of hydrocephalus.

Basal Cisterns: Basal cisterns are patent. No effacement or compression.

Bone Windows: No calvarial fractures identified.

IMPRESSION:
1. Normal CT head examination.
2. No acute intracranial abnormality.`;
    }

    if (params.modality === 'CT' && params.bodyRegion === 'CHEST') {
      return `TECHNIQUE:
Helical CT of the chest with axial and coronal reconstructions was performed following intravenous contrast administration.

FINDINGS:
Lungs: Lungs are clear bilaterally. No focal consolidations, nodules, or masses. No pleural effusions or pneumothoraces.

Mediastinum: Mediastinal and hilar contours are normal. No lymphadenopathy.

Heart: Heart is normal in size. No pericardial effusion.

IMPRESSION:
1. Normal CT chest examination.
2. No cardiopulmonary abnormality.`;
    }

    return `FINDINGS:
Normal examination. No abnormalities identified.

IMPRESSION:
1. Normal study.`;
  }

  return {
    complete,
    streamComplete,
    config: {
      endpoint,
      apiKey,
      model,
      timeout,
      maxRetries
    }
  };
}

/**
 * Creates a mock AI client for testing
 * @returns {Object} Mock AI client
 */
export function createMockAIClient() {
  return createAIClient({
    model: 'mock-model',
    timeout: 1000
  });
}

/**
 * Validates AI configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
export function validateAIConfig(config) {
  const errors = [];

  if (!config.endpoint && !config.apiKey) {
    // This is okay for mock client
  }

  if (config.timeout && (config.timeout < 1000 || config.timeout > 120000)) {
    errors.push('Timeout must be between 1000ms and 120000ms');
  }

  if (config.maxRetries && (config.maxRetries < 0 || config.maxRetries > 10)) {
    errors.push('Max retries must be between 0 and 10');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Handles API errors
 * @param {Error} error - Error object
 * @returns {Object} Formatted error
 */
export function handleAIError(error) {
  const errorMessages = {
    'timeout': 'Request timed out',
    'rate_limit': 'Rate limit exceeded',
    'invalid_api_key': 'Invalid API key',
    'insufficient_quota': 'Insufficient API quota',
    'network_error': 'Network error occurred',
    'invalid_request': 'Invalid request parameters',
    'server_error': 'Server error occurred'
  };

  const message = error.message || 'Unknown error';
  let code = 'UNKNOWN_ERROR';

  for (const [key, msg] of Object.entries(errorMessages)) {
    if (message.toLowerCase().includes(key)) {
      code = key.toUpperCase();
      break;
    }
  }

  return {
    error: code,
    message: errorMessages[code] || message,
    status: code === 'NETWORK_ERROR' ? 503 : 500
  };
}

export default {
  createAIClient,
  createMockAIClient,
  validateAIConfig,
  handleAIError
};