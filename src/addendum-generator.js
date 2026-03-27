/**
 * Addendum Generator Module - Create Report Addenda
 * Part of RadReport AI Engine Components
 */

import { createAddendum } from './data-models.js';

/**
 * Creates an addendum to a report
 * @param {Object} report - Original report
 * @param {Object} addendumData - Addendum data
 * @returns {Object} Addendum object
 */
export function createAddendum(report, addendumData) {
  const now = new Date().toISOString();
  
  const addendum = createAddendum({
    id: `add_${Date.now()}`,
    reportId: report.id,
    type: addendumData.type || 'CLARIFICATION',
    content: addendumData.content,
    reason: addendumData.reason || '',
    createdAt: now,
    createdBy: addendumData.createdBy || 'SYSTEM'
  });

  return addendum;
}

/**
 * Generates addendum content based on type
 * @param {string} addendumType - Type of addendum
 * @param {Object} data - Additional data
 * @returns {string} Addendum content
 */
export function generateAddendumContent(addendumType, data) {
  switch (addendumType) {
    case 'CLARIFICATION':
      return generateClarificationContent(data);
    case 'CORRECTION':
      return generateCorrectionContent(data);
    case 'ADDITIONAL_FINDINGS':
      return generateAdditionalFindingsContent(data);
    case 'FOLLOWUP_INFO':
      return generateFollowupInfoContent(data);
    case 'COMPARISON':
      return generateComparisonContent(data);
    case 'CORRELATION':
      return generateCorrelationContent(data);
    default:
      return data.content || '';
  }
}

/**
 * Generates clarification content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateClarificationContent(data) {
  const parts = [];
  
  parts.push('CLARIFICATION:');
  parts.push('');
  
  if (data.originalSection) {
    parts.push(`Original ${data.originalSection}: ${data.originalContent || 'N/A'}`);
    parts.push('');
  }
  
  parts.push('Clarified finding:');
  parts.push(data.clarifiedContent || '');
  
  if (data.explanation) {
    parts.push('');
    parts.push(`Explanation: ${data.explanation}`);
  }

  return parts.join('\n');
}

/**
 * Generates correction content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateCorrectionContent(data) {
  const parts = [];
  
  parts.push('CORRECTION:');
  parts.push('');
  
  if (data.errorDescription) {
    parts.push(`Error identified: ${data.errorDescription}`);
    parts.push('');
  }
  
  parts.push('Corrected content:');
  parts.push(data.correctedContent || '');
  
  if (data.reason) {
    parts.push('');
    parts.push(`Reason for correction: ${data.reason}`);
  }

  return parts.join('\n');
}

/**
 * Generates additional findings content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateAdditionalFindingsContent(data) {
  const parts = [];
  
  parts.push('ADDITIONAL FINDINGS:');
  parts.push('');
  parts.push(data.findings || '');
  
  if (data.recommendation) {
    parts.push('');
    parts.push(`Recommendation: ${data.recommendation}`);
  }

  return parts.join('\n');
}

/**
 * Generates followup info content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateFollowupInfoContent(data) {
  const parts = [];
  
  parts.push('FOLLOW-UP INFORMATION:');
  parts.push('');
  
  if (data.priorReportDate) {
    parts.push(`Compared to prior report from: ${data.priorReportDate}`);
    parts.push('');
  }
  
  parts.push('Changes noted:');
  parts.push(data.changes || 'No significant interval change');
  
  if (data.newRecommendations) {
    parts.push('');
    parts.push('Updated recommendations:');
    parts.push(data.newRecommendations);
  }

  return parts.join('\n');
}

/**
 * Generates comparison content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateComparisonContent(data) {
  const parts = [];
  
  parts.push('COMPARISON:');
  parts.push('');
  
  if (data.comparisonStudy) {
    parts.push(`Compared to: ${data.comparisonStudy}`);
    parts.push('');
  }
  
  parts.push('Comparison findings:');
  parts.push(data.comparisonContent || '');

  return parts.join('\n');
}

/**
 * Generates correlation content
 * @param {Object} data - Data for content
 * @returns {string} Content
 */
function generateCorrelationContent(data) {
  const parts = [];
  
  parts.push('CLINICAL CORRELATION:');
  parts.push('');
  
  if (data.clinicalHistory) {
    parts.push(`Clinical history: ${data.clinicalHistory}`);
    parts.push('');
  }
  
  parts.push('Correlation:');
  parts.push(data.correlation || '');

  return parts.join('\n');
}

/**
 * Applies addendum to report
 * @param {Object} report - Original report
 * @param {Object} addendum - Addendum to apply
 * @returns {Object} Updated report
 */
export function applyAddendum(report, addendum) {
  // Add addendum to report
  const addendums = report.addendums || [];
  addendums.push(addendum);

  return {
    ...report,
    addendums,
    updatedAt: new Date().toISOString(),
    previousVersion: report.version,
    version: report.version + 1
  };
}

/**
 * Formats addendum for display
 * @param {Object} addendum - Addendum to format
 * @returns {string} Formatted addendum
 */
export function formatAddendum(addendum) {
  const lines = [];
  
  lines.push('═'.repeat(50));
  lines.push(`ADDENDUM - ${addendum.type}`);
  lines.push(`Date: ${new Date(addendum.createdAt).toLocaleString()}`);
  lines.push(`By: ${addendum.createdBy}`);
  lines.push('═'.repeat(50));
  lines.push('');
  lines.push(addendum.content);
  
  if (addendum.reason) {
    lines.push('');
    lines.push(`Reason: ${addendum.reason}`);
  }
  
  return lines.join('\n');
}

/**
 * Validates addendum data
 * @param {Object} addendumData - Data to validate
 * @returns {Object} Validation result
 */
export function validateAddendumData(addendumData) {
  const errors = [];
  
  if (!addendumData.content) {
    errors.push('Addendum content is required');
  }
  
  const validTypes = ['CLARIFICATION', 'CORRECTION', 'ADDITIONAL_FINDINGS', 'FOLLOWUP_INFO', 'COMPARISON', 'CORRELATION'];
  if (addendumData.type && !validTypes.includes(addendumData.type)) {
    errors.push('Invalid addendum type');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gets addendum types
 * @returns {Array} Array of valid addendum types
 */
export function getAddendumTypes() {
  return [
    { type: 'CLARIFICATION', description: 'Clarify existing findings' },
    { type: 'CORRECTION', description: 'Correct errors in original report' },
    { type: 'ADDITIONAL_FINDINGS', description: 'Add new findings not in original' },
    { type: 'FOLLOWUP_INFO', description: 'Add follow-up comparison information' },
    { type: 'COMPARISON', description: 'Add comparison with prior studies' },
    { type: 'CORRELATION', description: 'Add clinical correlation information' }
  ];
}

export default {
  createAddendum,
  generateAddendumContent,
  applyAddendum,
  formatAddendum,
  validateAddendumData,
  getAddendumTypes
};