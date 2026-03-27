/**
 * Date Utilities Module - Date/Time Functions
 * Part of RadReport AI Core Utilities
 */

/**
 * Gets current ISO timestamp
 * @returns {string} ISO 8601 formatted timestamp
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Gets current date only (YYYY-MM-DD)
 * @returns {string} Date string
 */
export function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Gets current time only (HH:MM:SS)
 * @returns {string} Time string
 */
export function getCurrentTime() {
  return new Date().toTimeString().split(' ')[0];
}

/**
 * Parses ISO date string to Date object
 * @param {string} isoDate - ISO date string
 * @returns {Date|null} Date object or null if invalid
 */
export function parseISODate(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats Date object to ISO string
 * @param {Date} date - Date object
 * @returns {string} ISO string
 */
export function formatToISO(date) {
  if (!date || !(date instanceof Date)) return null;
  return date.toISOString();
}

/**
 * Formats Date to readable string (MM/DD/YYYY)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return '';
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Formats Date to readable string with time (MM/DD/YYYY HH:MM)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date/time string
 */
export function formatDateTime(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return '';
  const dateStr = formatDate(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Formats Date to ISO date only (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} ISO date string
 */
export function formatToISODate(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return '';
  return d.toISOString().split('T')[0];
}

/**
 * Adds days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date object
 */
export function addDays(date, days) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Adds months to a date
 * @param {Date|string} date - Starting date
 * @param {number} months - Number of months to add (can be negative)
 * @returns {Date} New date object
 */
export function addMonths(date, months) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Adds years to a date
 * @param {Date|string} date - Starting date
 * @param {number} years - Number of years to add (can be negative)
 * @returns {Date} New date object
 */
export function addYears(date, years) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Calculates difference in days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Number of days difference
 */
export function getDaysDifference(date1, date2) {
  const d1 = date1 instanceof Date ? date1 : parseISODate(date1);
  const d2 = date2 instanceof Date ? date2 : parseISODate(date2);
  if (!d1 || !d2) return 0;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates difference in months between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Number of months difference
 */
export function getMonthsDifference(date1, date2) {
  const d1 = date1 instanceof Date ? date1 : parseISODate(date1);
  const d2 = date2 instanceof Date ? date2 : parseISODate(date2);
  if (!d1 || !d2) return 0;
  const months = (d2.getFullYear() - d1.getFullYear()) * 12;
  return months + (d2.getMonth() - d1.getMonth());
}

/**
 * Checks if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return false;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Checks if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return false;
  return d.getTime() < Date.now();
}

/**
 * Checks if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return false;
  return d.getTime() > Date.now();
}

/**
 * Gets start of day (midnight)
 * @param {Date|string} date - Date
 * @returns {Date} Start of day
 */
export function startOfDay(date) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets end of day (23:59:59)
 * @param {Date|string} date - Date
 * @returns {Date} End of day
 */
export function endOfDay(date) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Gets start of week (Sunday)
 * @param {Date|string} date - Date
 * @returns {Date} Start of week
 */
export function startOfWeek(date) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets start of month
 * @param {Date|string} date - Date
 * @returns {Date} Start of month
 */
export function startOfMonth(date) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets end of month
 * @param {Date|string} date - Date
 * @returns {Date} End of month
 */
export function endOfMonth(date) {
  const d = date instanceof Date ? new Date(date) : parseISODate(date);
  if (!d) return null;
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Parses relative date string (e.g., "today", "yesterday", "-7days")
 * @param {string} relativeStr - Relative date string
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseRelativeDate(relativeStr) {
  if (!relativeStr) return null;
  const lower = relativeStr.toLowerCase().trim();
  const today = new Date();
  
  switch (lower) {
    case 'today':
      return startOfDay(today);
    case 'yesterday':
      return startOfDay(addDays(today, -1));
    case 'tomorrow':
      return startOfDay(addDays(today, 1));
    case 'startofweek':
      return startOfWeek(today);
    case 'startofmonth':
      return startOfMonth(today);
    case 'endofmonth':
      return endOfMonth(today);
    default:
      // Handle relative day offsets like "-7days", "+3days"
      const match = lower.match(/^([+-]?)(\d+)(days?|weeks?|months?|years?)$/);
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const amount = parseInt(match[2], 10);
        const unit = match[3].toLowerCase();
        
        if (unit.startsWith('day')) return addDays(today, sign * amount);
        if (unit.startsWith('week')) return addDays(today, sign * amount * 7);
        if (unit.startsWith('month')) return addMonths(today, sign * amount);
        if (unit.startsWith('year')) return addYears(today, sign * amount);
      }
      return null;
  }
}

/**
 * Formats relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const d = date instanceof Date ? date : parseISODate(date);
  if (!d) return 'unknown';
  
  const now = Date.now();
  const diffMs = now - d.getTime();
  const absMs = Math.abs(diffMs);
  
  const seconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (diffMs < 0) {
    // Future
    if (minutes < 1) return 'in a moment';
    if (minutes < 60) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (days < 7) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (weeks < 4) return `in ${weeks} week${weeks > 1 ? 's' : ''}`;
    if (months < 12) return `in ${months} month${months > 1 ? 's' : ''}`;
    return `in ${years} year${years > 1 ? 's' : ''}`;
  } else {
    // Past
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * Validates date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} Validation result
 */
export function validateDateRange(startDate, endDate) {
  const start = startDate instanceof Date ? startDate : parseISODate(startDate);
  const end = endDate instanceof Date ? endDate : parseISODate(endDate);
  
  if (!start || !end) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (start > end) {
    return { isValid: false, error: 'Start date must be before end date' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Generates date range array
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Array} Array of date strings
 */
export function generateDateRange(startDate, endDate) {
  const start = startDate instanceof Date ? startDate : parseISODate(startDate);
  const end = endDate instanceof Date ? endDate : parseISODate(endDate);
  
  if (!start || !end) return [];
  
  const dates = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(formatToISODate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

export default {
  getCurrentTimestamp,
  getCurrentDate,
  getCurrentTime,
  parseISODate,
  formatToISO,
  formatDate,
  formatDateTime,
  formatToISODate,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
  getMonthsDifference,
  isToday,
  isPast,
  isFuture,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  parseRelativeDate,
  formatRelativeTime,
  validateDateRange,
  generateDateRange
};