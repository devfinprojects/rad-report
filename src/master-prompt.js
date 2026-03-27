/**
 * Master Prompt Module - AI Prompt Templates and Management
 * Part of RadReport AI Configuration & Prompts
 */

/**
 * Default system prompt for radiology report generation
 */
export const SYSTEM_PROMPT = `You are an expert radiology report assistant specialized in generating high-quality, standardized radiology reports. Your task is to help radiologists create accurate, comprehensive, and clinically meaningful reports.

## Guidelines:
1. Use standard radiology terminology and phrasing
2. Follow the established template structure (TECHNIQUE, FINDINGS, IMPRESSION)
3. Be concise but thorough in your descriptions
4. Use appropriate anatomical orientation and directional terms
5. Include relevant measurements when applicable
6. Note any significant findings that require attention
7. Provide clear, actionable impressions

## Report Structure:
- TECHNIQUE: Describe the imaging modality, contrast, and any special techniques
- FINDINGS: Systematically describe each anatomical structure examined
- IMPRESSION: Summarize key findings and provide clinical correlation or recommendations

Always maintain professional medical language and adhere to HIPAA guidelines regarding patient information.`;

export const TEMPLATE_PROMPT = `Generate a radiology report based on the following template and user input.

Template Information:
- Modality: {modality}
- Body Region: {bodyRegion}
- System: {system}

Template Structure:
{templateText}

User Input:
{userInput}

Please fill in the template placeholders with appropriate content based on the user's input. Maintain the professional tone and standard radiology formatting.`;

export const SNIPPET_PROMPT = `You are helping expand a snippet trigger in a radiology report.

Snippet Trigger: {trigger}
Snippet Name: {name}
Category: {category}

Current Report Context:
{context}

Please expand this snippet with medically appropriate content. Consider the current context of the report and maintain consistency with the existing report style and structure.`;

export const IMPRESSION_PROMPT = `Based on the FINDINGS section of a radiology report, generate a concise and clinically relevant IMPRESSION.

Findings:
{findings}

Study Type: {studyType}
Clinical History: {clinicalHistory}

Generate an impression that:
1. Summarizes the key findings
2. Provides clinical correlation when appropriate
3. Includes recommendations for follow-up if needed
4. Uses appropriate urgency based on findings`;

export const COMPARISON_PROMPT = `Compare the current imaging findings with prior studies.

Current Findings:
{currentFindings}

Prior Study Date: {priorDate}
Prior Findings:
{priorFindings}

Generate a comparison summary that:
1. Notes any changes from prior studies
2. Describes any new findings
3. Notes resolution or progression of previous findings
4. Provides clinical significance of changes`;

export const NORMAL_VARIANT_PROMPT = `Based on the described findings, determine if the study appears normal or if there are findings requiring attention.

Findings:
{findings}

Generate a normal report interpretation that:
1. Confirms normal appearance of all structures examined
2. Notes any normal variants if present
3. Provides appropriate normal impression language
4. Includes routine follow-up recommendations if applicable`;

export const FINDING_DESCRIPTION_PROMPT = `Generate a detailed finding description for a radiology report.

Finding: {finding}
Location: {location}
Modality: {modality}

Provide a thorough description including:
1. Size and dimensions if applicable
2. Density/signal characteristics
3. Margins and borders
4. Relationship to adjacent structures
5. Any associated findings`;

export const ADDENDUM_PROMPT = `Generate an addendum to an existing radiology report.

Original Report Summary:
{originalReport}

Addendum Type: {addendumType}
New Information: {newInformation}

Create a professional addendum that:
1. Clearly states it is an addendum to the original report
2. Incorporates the new information appropriately
3. Maintains consistency with the original report style
4. Includes revised impressions if needed`;

export const FOLLOWUP_RECOMMENDATION_PROMPT = `Generate appropriate follow-up recommendations based on findings.

Findings:
{findings}
Modality: {modality}
Body Region: {bodyRegion}

Provide follow-up recommendations that:
1. Are evidence-based and appropriate for the findings
2. Specify timing (3 months, 6 months, 1 year, etc.)
3. Include modality for follow-up if relevant
4. Note clinical correlation recommendations`;

export const DASHBOARD_SUMMARY_PROMPT = `Generate a summary of radiology report statistics.

Report Data:
{reportData}

Create a dashboard summary that:
1. Summarizes total reports generated
2. Notes modality distribution
3. Includes common findings patterns
4. Provides workflow statistics`;

/**
 * Gets the appropriate prompt based on operation type
 * @param {string} operationType - Type of operation
 * @param {Object} params - Parameters for the prompt
 * @returns {string} Formatted prompt
 */
export function getPrompt(operationType, params = {}) {
  let prompt = '';
  
  switch (operationType) {
    case 'template':
      prompt = TEMPLATE_PROMPT;
      break;
    case 'snippet':
      prompt = SNIPPET_PROMPT;
      break;
    case 'impression':
      prompt = IMPRESSION_PROMPT;
      break;
    case 'comparison':
      prompt = COMPARISON_PROMPT;
      break;
    case 'normal':
      prompt = NORMAL_VARIANT_PROMPT;
      break;
    case 'finding':
      prompt = FINDING_DESCRIPTION_PROMPT;
      break;
    case 'addendum':
      prompt = ADDENDUM_PROMPT;
      break;
    case 'followup':
      prompt = FOLLOWUP_RECOMMENDATION_PROMPT;
      break;
    case 'dashboard':
      prompt = DASHBOARD_SUMMARY_PROMPT;
      break;
    default:
      prompt = SYSTEM_PROMPT;
  }
  
  // Replace placeholders with actual values
  return replacePlaceholders(prompt, params);
}

/**
 * Replaces placeholders in prompt template with actual values
 * @param {string} template - Prompt template
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted prompt
 */
function replacePlaceholders(template, params) {
  let result = template;
  
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{${key}}`;
    result = result.split(placeholder).join(value || '');
  }
  
  return result;
}

/**
 * Builds full prompt with system context and user input
 * @param {Object} options - Prompt options
 * @returns {Object} Complete prompt object
 */
export function buildPrompt(options) {
  const {
    system = true,
    operationType,
    params,
    temperature = 0.7,
    maxTokens = 2000,
    context = []
  } = options;
  
  const messages = [];
  
  // Add system message
  if (system) {
    messages.push({
      role: 'system',
      content: SYSTEM_PROMPT
    });
  }
  
  // Add conversation context
  for (const ctx of context) {
    messages.push({
      role: ctx.role || 'user',
      content: ctx.content
    });
  }
  
  // Add main prompt
  const promptContent = operationType ? getPrompt(operationType, params) : params.content || '';
  messages.push({
    role: 'user',
    content: promptContent
  });
  
  return {
    messages,
    temperature,
    max_tokens: maxTokens
  };
}

/**
 * Gets AI model configuration presets
 * @param {string} preset - Preset name
 * @returns {Object} Model configuration
 */
export function getModelConfig(preset = 'default') {
  const presets = {
    default: {
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    },
    concise: {
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 0.8,
      frequency_penalty: 0.1,
      presence_penalty: 0.0
    },
    detailed: {
      temperature: 0.8,
      max_tokens: 4000,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.1
    },
    creative: {
      temperature: 1.0,
      max_tokens: 3000,
      top_p: 1.0,
      frequency_penalty: 0.2,
      presence_penalty: 0.2
    }
  };
  
  return presets[preset] || presets.default;
}

/**
 * Validates prompt parameters
 * @param {Object} params - Prompt parameters
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
  SYSTEM_PROMPT,
  TEMPLATE_PROMPT,
  SNIPPET_PROMPT,
  IMPRESSION_PROMPT,
  COMPARISON_PROMPT,
  NORMAL_VARIANT_PROMPT,
  FINDING_DESCRIPTION_PROMPT,
  ADDENDUM_PROMPT,
  FOLLOWUP_RECOMMENDATION_PROMPT,
  DASHBOARD_SUMMARY_PROMPT,
  getPrompt,
  buildPrompt,
  getModelConfig,
  validatePromptParams
};