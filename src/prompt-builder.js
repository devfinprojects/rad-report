/**
 * Prompt Builder Module - AI Prompt Construction
 * Part of RadReport AI Engine Components
 */

import { getPrompt, buildPrompt, getModelConfig } from './master-prompt.js';

/**
 * Builds a template-based prompt
 * @param {Object} template - Template object
 * @param {Object} data - User data to fill template
 * @returns {Object} Complete prompt object
 */
export function buildTemplatePrompt(template, data) {
  if (!template || !data) {
    return buildPrompt({
      operationType: 'template',
      params: { content: 'Generate a radiology report.' }
    });
  }

  const templateText = template.templateText;
  const filledText = fillTemplate(templateText, data);
  
  const params = {
    modality: template.modality || '',
    bodyRegion: template.bodyRegion || '',
    system: template.system || '',
    templateText: templateText,
    userInput: data.userInput || '',
    filledReport: filledText
  };

  return buildPrompt({
    operationType: 'template',
    params,
    temperature: data.temperature || 0.7,
    maxTokens: data.maxTokens || 2000
  });
}

/**
 * Fills template with user data
 * @param {string} templateText - Template text with placeholders
 * @param {Object} data - Data to fill
 * @returns {string} Filled text
 */
function fillTemplate(templateText, data) {
  let result = templateText;
  
  // Replace common placeholders
  const replacements = {
    '___': data.placeholder || '',
    '{modality}': data.modality || '',
    '{bodyRegion}': data.bodyRegion || '',
    '{system}': data.system || '',
    '{patientName}': data.patientName || '',
    '{clinicalHistory}': data.clinicalHistory || '',
    '{technique}': data.technique || '',
    '{findings}': data.findings || '',
    '{impression}': data.impression || ''
  };

  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(key).join(value);
  }

  return result;
}

/**
 * Builds an impression generation prompt
 * @param {Object} findings - Findings text
 * @param {Object} options - Additional options
 * @returns {Object} Complete prompt
 */
export function buildImpressionPrompt(findings, options = {}) {
  const params = {
    findings: findings || '',
    studyType: options.studyType || '',
    clinicalHistory: options.clinicalHistory || ''
  };

  return buildPrompt({
    operationType: 'impression',
    params,
    temperature: options.temperature || 0.7,
    maxTokens: options.maxTokens || 500
  });
}

/**
 * Builds a comparison prompt
 * @param {string} currentFindings - Current study findings
 * @param {string} priorFindings - Prior study findings
 * @param {string} priorDate - Prior study date
 * @param {Object} options - Additional options
 * @returns {Object} Complete prompt
 */
export function buildComparisonPrompt(currentFindings, priorFindings, priorDate, options = {}) {
  const params = {
    currentFindings: currentFindings || '',
    priorFindings: priorFindings || '',
    priorDate: priorDate || ''
  };

  return buildPrompt({
    operationType: 'comparison',
    params,
    temperature: options.temperature || 0.5,
    maxTokens: options.maxTokens || 300
  });
}

/**
 * Builds a normal report variant prompt
 * @param {Object} findings - Findings to interpret as normal
 * @param {Object} options - Additional options
 * @returns {Object} Complete prompt
 */
export function buildNormalVariantPrompt(findings, options = {}) {
  const params = {
    findings: findings || ''
  };

  return buildPrompt({
    operationType: 'normal',
    params,
    temperature: options.temperature || 0.7,
    maxTokens: options.maxTokens || 1000
  });
}

/**
 * Builds a followup recommendation prompt
 * @param {Object} findings - Findings requiring followup
 * @param {Object} options - Additional options
 * @returns {Object} Complete prompt
 */
export function buildFollowupPrompt(findings, options = {}) {
  const params = {
    findings: findings || '',
    modality: options.modality || '',
    bodyRegion: options.bodyRegion || ''
  };

  return buildPrompt({
    operationType: 'followup',
    params,
    temperature: options.temperature || 0.6,
    maxTokens: options.maxTokens || 400
  });
}

/**
 * Builds an addendum prompt
 * @param {Object} addendumData - Addendum data
 * @returns {Object} Complete prompt
 */
export function buildAddendumPrompt(addendumData) {
  const params = {
    originalReport: addendumData.originalReport || '',
    addendumType: addendumData.type || 'CLARIFICATION',
    newInformation: addendumData.content || ''
  };

  return buildPrompt({
    operationType: 'addendum',
    params,
    temperature: 0.7,
    maxTokens: 500
  });
}

/**
 * Builds a dashboard summary prompt
 * @param {Object} reportData - Aggregated report data
 * @returns {Object} Complete prompt
 */
export function buildDashboardPrompt(reportData) {
  const params = {
    reportData: JSON.stringify(reportData)
  };

  return buildPrompt({
    operationType: 'dashboard',
    params,
    temperature: 0.5,
    maxTokens: 1000
  });
}

/**
 * Builds a snippet expansion prompt
 * @param {Object} snippet - Snippet to expand
 * @param {string} context - Report context
 * @returns {Object} Complete prompt
 */
export function buildSnippetPrompt(snippet, context) {
  const params = {
    trigger: snippet.trigger || '',
    name: snippet.name || '',
    category: snippet.category || '',
    context: context || ''
  };

  return buildPrompt({
    operationType: 'snippet',
    params,
    temperature: 0.7,
    maxTokens: snippet.maxTokens || 500
  });
}

/**
 * Builds a finding description prompt
 * @param {Object} findingData - Finding data
 * @returns {Object} Complete prompt
 */
export function buildFindingPrompt(findingData) {
  const params = {
    finding: findingData.finding || '',
    location: findingData.location || '',
    modality: findingData.modality || ''
  };

  return buildPrompt({
    operationType: 'finding',
    params,
    temperature: 0.7,
    maxTokens: 300
  });
}

/**
 * Builds a custom prompt with full control
 * @param {Object} options - Prompt options
 * @returns {Object} Complete prompt
 */
export function buildCustomPrompt(options) {
  const {
    systemMessage = true,
    context = [],
    content,
    temperature = 0.7,
    maxTokens = 2000,
    preset = 'default'
  } = options;

  const modelConfig = getModelConfig(preset);

  return buildPrompt({
    system: systemMessage,
    operationType: null,
    params: { content: content || '' },
    temperature: temperature || modelConfig.temperature,
    maxTokens: maxTokens || modelConfig.max_tokens,
    context: context
  });
}

/**
 * Creates a chat completion request
 * @param {Object} prompt - Built prompt
 * @param {Object} modelConfig - Model configuration
 * @returns {Object} API request body
 */
export function createCompletionRequest(prompt, modelConfig = {}) {
  return {
    model: modelConfig.model || 'default-model',
    messages: prompt.messages,
    temperature: prompt.temperature || 0.7,
    max_tokens: prompt.max_tokens || 2000,
    top_p: modelConfig.top_p || 0.9,
    frequency_penalty: modelConfig.frequency_penalty || 0.0,
    presence_penalty: modelConfig.presence_penalty || 0.0,
    stream: modelConfig.stream || false
  };
}

/**
 * Builds context for multi-turn conversation
 * @param {Array} history - Conversation history
 * @param {number} maxMessages - Maximum messages to include
 * @returns {Array} Context messages
 */
export function buildContext(history, maxMessages = 10) {
  if (!history || history.length === 0) return [];
  
  const recentMessages = history.slice(-maxMessages);
  
  return recentMessages.map(msg => ({
    role: msg.role || 'user',
    content: msg.content || ''
  }));
}

/**
 * Validates prompt parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} Validation result
 */
export function validatePromptParams(params) {
  const errors = [];
  
  if (params.maxTokens && (params.maxTokens < 100 || params.maxTokens > 10000)) {
    errors.push('maxTokens must be between 100 and 10000');
  }
  
  if (params.temperature && (params.temperature < 0 || params.temperature > 2)) {
    errors.push('temperature must be between 0 and 2');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  buildTemplatePrompt,
  buildImpressionPrompt,
  buildComparisonPrompt,
  buildNormalVariantPrompt,
  buildFollowupPrompt,
  buildAddendumPrompt,
  buildDashboardPrompt,
  buildSnippetPrompt,
  buildFindingPrompt,
  buildCustomPrompt,
  createCompletionRequest,
  buildContext,
  validatePromptParams
};