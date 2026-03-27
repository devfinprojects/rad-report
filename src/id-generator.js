/**
 * ID Generator Module - Unique Identifier Generation
 * Part of RadReport AI Core Utilities
 */

// Character sets for ID generation
const UUID_CHARS = '0123456789abcdef';
const ALPHANUMERIC_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMERIC_CHARS = '0123456789';
const SHORT_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a random character from a character set
 * @param {string} chars - Character set to use
 * @returns {string} Random character
 */
function getRandomChar(chars) {
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

/**
 * Generates a UUID v4 format string
 * @returns {string} UUID in format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID() {
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; // Version 4
    } else if (i === 19) {
      uuid += getRandomChar('89ab'); // Variant
    } else {
      uuid += getRandomChar(UUID_CHARS);
    }
  }
  return uuid;
}

/**
 * Generates a short ID (12 characters, alphanumeric)
 * @returns {string} Short ID string
 */
export function generateShortId() {
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += getRandomChar(SHORT_ID_CHARS);
  }
  return id;
}

/**
 * Generates a numeric ID
 * @param {number} length - Length of ID to generate
 * @returns {string} Numeric ID
 */
export function generateNumericId(length = 8) {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += getRandomChar(NUMERIC_CHARS);
  }
  return id;
}

/**
 * Generates an alphanumeric ID
 * @param {number} length - Length of ID to generate
 * @returns {string} Alphanumeric ID
 */
export function generateAlphanumericId(length = 10) {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += getRandomChar(ALPHANUMERIC_CHARS);
  }
  return id;
}

/**
 * Generates a session ID with prefix
 * @param {string} prefix - Prefix for the session ID (default: 'session')
 * @returns {string} Session ID
 */
export function generateSessionId(prefix = 'session') {
  return `${prefix}_${generateUUID()}`;
}

/**
 * Generates a report ID with prefix
 * @param {string} prefix - Prefix for the report ID (default: 'report')
 * @returns {string} Report ID
 */
export function generateReportId(prefix = 'report') {
  return `${prefix}_${generateShortId()}`;
}

/**
 * Generates a template ID
 * @param {string} modality - Modality code
 * @returns {string} Template ID
 */
export function generateTemplateId(modality = 'CT') {
  const timestamp = Date.now().toString(36);
  const randomPart = generateShortId().substring(0, 6);
  return `tpl_${modality.toLowerCase()}_${timestamp}_${randomPart}`;
}

/**
 * Generates a snippet ID
 * @param {string} category - Category code
 * @returns {string} Snippet ID
 */
export function generateSnippetId(category = 'finding') {
  const timestamp = Date.now().toString(36);
  const randomPart = generateShortId().substring(0, 4);
  return `snip_${category.toLowerCase().substring(0, 4)}_${timestamp}_${randomPart}`;
}

/**
 * Generates a patient study ID
 * @param {string} mrn - Medical Record Number
 * @returns {string} Study ID
 */
export function generateStudyId(mrn) {
  const timestamp = Date.now().toString(36);
  const mrnHash = mrn ? mrn.substring(0, 6).toUpperCase() : 'UNK';
  return `study_${mrnHash}_${timestamp}`;
}

/**
 * Generates an accession number
 * @returns {string} Accession number
 */
export function generateAccessionNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = generateNumericId(6);
  return `ACC${year}${month}${random}`;
}

/**
 * Generates a unique key for KV storage
 * @param {string} type - Type of entity (template, snippet, report, session)
 * @param {string} id - Entity ID
 * @returns {string} Storage key
 */
export function generateStorageKey(type, id) {
  return `${type}:${id}`;
}

/**
 * Extracts ID from storage key
 * @param {string} key - Storage key
 * @returns {string|null} Entity ID or null if invalid
 */
export function extractIdFromKey(key) {
  if (!key || typeof key !== 'string') return null;
  const parts = key.split(':');
  return parts.length > 1 ? parts[1] : null;
}

/**
 * Generates a hash from string (simple DJB2 variant)
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a bucket key for rate limiting
 * @param {string} identifier - User identifier (IP, user ID, etc.)
 * @param {string} window - Time window (minute, hour, day)
 * @returns {string} Rate limit bucket key
 */
export function generateRateLimitKey(identifier, window = 'minute') {
  const timestamp = Math.floor(Date.now() / (window === 'minute' ? 60000 : window === 'hour' ? 3600000 : 86400000));
  return `ratelimit:${identifier}:${window}:${timestamp}`;
}

/**
 * Generates a unique request ID for tracking
 * @returns {string} Request ID
 */
export function generateRequestId() {
  const timestamp = Date.now().toString(36);
  const random = generateShortId().substring(0, 8);
  return `req_${timestamp}_${random}`;
}

/**
 * Generates a dashboard metric ID
 * @param {string} metricType - Type of metric
 * @param {string} period - Time period
 * @returns {string} Metric ID
 */
export function generateMetricId(metricType, period) {
  return `metric_${metricType}_${period}_${Date.now()}`;
}

export default {
  generateUUID,
  generateShortId,
  generateNumericId,
  generateAlphanumericId,
  generateSessionId,
  generateReportId,
  generateTemplateId,
  generateSnippetId,
  generateStudyId,
  generateAccessionNumber,
  generateStorageKey,
  extractIdFromKey,
  hashString,
  generateRateLimitKey,
  generateRequestId,
  generateMetricId
};