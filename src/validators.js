/**
 * Validators Module - Input Validation Functions
 * Part of RadReport AI Core Utilities
 */

/**
 * Validates radiology modality type
 * @param {string} modality - Modality to validate
 * @returns {boolean} True if valid modality
 */
export function isValidModality(modality) {
  const validModalities = [
    'CT', 'MRI', 'X-RAY', 'ULTRASOUND', 'MAMMOGRAPHY', 'PET-CT',
    'DEXA', 'FLUOROSCOPY', 'ANGIOGRAPHY', 'NUCLEAR MEDICINE',
    'ULTRASOUND DOPPLER', 'CTA', 'MRA'
  ];
  return validModalities.includes((modality || '').toUpperCase().trim());
}

/**
 * Validates body region/scan area
 * @param {string} region - Body region to validate
 * @returns {boolean} True if valid body region
 */
export function isValidBodyRegion(region) {
  const validRegions = [
    'HEAD', 'NECK', 'CHEST', 'ABDOMEN', 'PELVIS', 'SPINE',
    'UPPER EXTREMITY', 'LOWER EXTREMITY', 'WHOLE BODY', 'HEART',
    'LIVER', 'KIDNEY', 'BRAIN', 'BREAST', 'BONE', 'JOINT'
  ];
  return validRegions.includes((region || '').toUpperCase().trim());
}

/**
 * Validates report status
 * @param {string} status - Report status to validate
 * @returns {boolean} True if valid status
 */
export function isValidReportStatus(status) {
  const validStatuses = [
    'DRAFT', 'PENDING_REVIEW', 'REVIEWED', 'SIGNED',
    'AMENDED', 'ADDENDED', 'VOIDED', 'ARCHIVED'
  ];
  return validStatuses.includes((status || '').toUpperCase().trim());
}

/**
 * Validates patient age group
 * @param {string} ageGroup - Age group to validate
 * @returns {boolean} True if valid age group
 */
export function isValidAgeGroup(ageGroup) {
  const validAgeGroups = [
    'NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT',
    'ADULT', 'ELDERLY', 'UNKNOWN'
  ];
  return validAgeGroups.includes((ageGroup || '').toUpperCase().trim());
}

/**
 * Validates urgency level
 * @param {string} urgency - Urgency level to validate
 * @returns {boolean} True if valid urgency
 */
export function isValidUrgency(urgency) {
  const validUrgencies = ['ROUTINE', 'STAT', 'URGENT', 'ELEVATED'];
  return validUrgencies.includes((urgency || '').toUpperCase().trim());
}

/**
 * Validates date string format (ISO 8601)
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid ISO date
 */
export function isValidISODate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && dateStr.includes('T');
}

/**
 * Validates UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid || '');
}

/**
 * Validates medical record number format
 * @param {string} mrn - Medical record number
 * @returns {boolean} True if valid MRN format
 */
export function isValidMRN(mrn) {
  if (!mrn || typeof mrn !== 'string') return false;
  return mrn.length >= 4 && mrn.length <= 20 && /^[A-Za-z0-9-]+$/.test(mrn);
}

/**
 * Validates accession number format
 * @param {string} accession - Accession number
 * @returns {boolean} True if valid accession format
 */
export function isValidAccession(accession) {
  if (!accession || typeof accession !== 'string') return false;
  return accession.length >= 6 && accession.length <= 20 && /^[A-Za-z0-9-]+$/.test(accession);
}

/**
 * Validates report text content
 * @param {string} text - Report text to validate
 * @param {number} minLength - Minimum length required
 * @returns {Object} Validation result with isValid and error
 */
export function validateReportText(text, minLength = 10) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Report text is required' };
  }
  if (text.trim().length < minLength) {
    return { isValid: false, error: `Report must be at least ${minLength} characters` };
  }
  if (text.length > 50000) {
    return { isValid: false, error: 'Report exceeds maximum length of 50000 characters' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates template object structure
 * @param {Object} template - Template object to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateTemplate(template) {
  const errors = [];
  
  if (!template) {
    return { isValid: false, errors: ['Template is required'] };
  }
  
  if (!template.id || typeof template.id !== 'string') {
    errors.push('Template ID is required and must be a string');
  }
  
  if (!template.modality || !isValidModality(template.modality)) {
    errors.push('Valid modality is required');
  }
  
  if (!template.name || typeof template.name !== 'string') {
    errors.push('Template name is required');
  }
  
  if (!template.templateText || typeof template.templateText !== 'string') {
    errors.push('Template text is required');
  }
  
  if (!template.bodyRegion || !isValidBodyRegion(template.bodyRegion)) {
    errors.push('Valid body region is required');
  }
  
  if (!Array.isArray(template.anatomyChecklist)) {
    errors.push('Anatomy checklist must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates snippet object structure
 * @param {Object} snippet - Snippet object to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateSnippet(snippet) {
  const errors = [];
  
  if (!snippet) {
    return { isValid: false, errors: ['Snippet is required'] };
  }
  
  if (!snippet.id || typeof snippet.id !== 'string') {
    errors.push('Snippet ID is required and must be a string');
  }
  
  if (!snippet.trigger || typeof snippet.trigger !== 'string') {
    errors.push('Snippet trigger is required');
  }
  
  if (!snippet.trigger.startsWith('/')) {
    errors.push('Snippet trigger must start with /');
  }
  
  if (!snippet.name || typeof snippet.name !== 'string') {
    errors.push('Snippet name is required');
  }
  
  if (!snippet.expansion || typeof snippet.expansion !== 'string') {
    errors.push('Snippet expansion is required');
  }
  
  if (!snippet.category || typeof snippet.category !== 'string') {
    errors.push('Snippet category is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates session object structure
 * @param {Object} session - Session object to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateSession(session) {
  const errors = [];
  
  if (!session) {
    return { isValid: false, errors: ['Session is required'] };
  }
  
  if (!session.id || !isValidUUID(session.id)) {
    errors.push('Valid session ID is required');
  }
  
  if (!session.createdAt || !isValidISODate(session.createdAt)) {
    errors.push('Valid createdAt timestamp is required');
  }
  
  if (session.expiredAt && !isValidISODate(session.expiredAt)) {
    errors.push('Invalid expiredAt timestamp format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates environment configuration
 * @param {Object} env - Cloudflare environment object
 * @returns {string|null} Error message or null if valid
 */
export function validateEnvironment(env) {
  if (!env) {
    return 'Environment configuration is missing';
  }
  
  // Check for required KV namespaces
  const requiredKV = ['TEMPLATES', 'SNIPPETS', 'REPORTS', 'SESSIONS'];
  for (const kv of requiredKV) {
    if (!env[kv]) {
      return `Required KV namespace ${kv} is not configured`;
    }
  }
  
  return null;
}

/**
 * Validates API request body
 * @param {Object} body - Request body to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateRequestBody(body, requiredFields = []) {
  const errors = [];
  
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object'] };
  }
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      errors.push(`Required field '${field}' is missing`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePagination(page = 1, limit = 20) {
  const errors = [];
  
  if (typeof page !== 'number' || page < 1) {
    errors.push('Page must be a positive number');
  }
  
  if (typeof limit !== 'number' || limit < 1 || limit > 100) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    page: Math.max(1, Math.floor(page)),
    limit: Math.min(100, Math.max(1, Math.floor(limit)))
  };
}

/**
 * Sanitizes HTML/script input
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Validates filter options
 * @param {Object} filters - Filter options object
 * @returns {Object} Validation result
 */
export function validateFilters(filters) {
  const validFilters = ['modality', 'bodyRegion', 'system', 'status', 'urgency', 'dateRange'];
  const errors = [];
  const validFiltersObj = {};
  
  if (!filters || typeof filters !== 'object') {
    return { isValid: true, filters: {} };
  }
  
  for (const [key, value] of Object.entries(filters)) {
    if (!validFilters.includes(key)) {
      errors.push(`Invalid filter: ${key}`);
    } else if (value !== null && value !== undefined && value !== '') {
      validFiltersObj[key] = value;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    filters: validFiltersObj
  };
}

export default {
  isValidModality,
  isValidBodyRegion,
  isValidReportStatus,
  isValidAgeGroup,
  isValidUrgency,
  isValidISODate,
  isValidUUID,
  isValidMRN,
  isValidAccession,
  validateReportText,
  validateTemplate,
  validateSnippet,
  validateSession,
  validateEnvironment,
  validateRequestBody,
  validatePagination,
  sanitizeInput,
  validateFilters
};