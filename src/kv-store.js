/**
 * KV Store Module - Cloudflare KV Storage Interface
 * Part of RadReport AI Data Layer
 */

import { createTemplate, deserializeTemplate, serializeTemplate, createSnippet, deserializeSnippet, serializeSnippet, createReport, deserializeReport, serializeReport } from './data-models.js';

/**
 * Gets all templates from KV storage
 * @param {Object} kv - KV namespace
 * @returns {Array} Array of templates
 */
export async function getAllTemplates(kv) {
  if (!kv) return [];
  
  try {
    const list = await kv.list({ prefix: 'template:' });
    const templates = [];
    
    for (const key of list.keys) {
      const data = await kv.get(key.name);
      if (data) {
        const template = deserializeTemplate(data);
        if (template) templates.push(template);
      }
    }
    
    return templates;
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
}

/**
 * Gets a single template by ID
 * @param {Object} kv - KV namespace
 * @param {string} id - Template ID
 * @returns {Object|null} Template object or null
 */
export async function getTemplate(kv, id) {
  if (!kv || !id) return null;
  
  try {
    const data = await kv.get(`template:${id}`);
    return data ? deserializeTemplate(data) : null;
  } catch (error) {
    console.error('Error getting template:', error);
    return null;
  }
}

/**
 * Saves a template to KV storage
 * @param {Object} kv - KV namespace
 * @param {Object} template - Template object
 * @returns {boolean} Success status
 */
export async function saveTemplate(kv, template) {
  if (!kv || !template || !template.id) return false;
  
  try {
    const serialized = serializeTemplate(template);
    await kv.put(`template:${template.id}`, serialized);
    return true;
  } catch (error) {
    console.error('Error saving template:', error);
    return false;
  }
}

/**
 * Deletes a template from KV storage
 * @param {Object} kv - KV namespace
 * @param {string} id - Template ID
 * @returns {boolean} Success status
 */
export async function deleteTemplate(kv, id) {
  if (!kv || !id) return false;
  
  try {
    await kv.delete(`template:${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
}

/**
 * Gets all snippets from KV storage
 * @param {Object} kv - KV namespace
 * @returns {Array} Array of snippets
 */
export async function getAllSnippets(kv) {
  if (!kv) return [];
  
  try {
    const list = await kv.list({ prefix: 'snippet:' });
    const snippets = [];
    
    for (const key of list.keys) {
      const data = await kv.get(key.name);
      if (data) {
        const snippet = deserializeSnippet(data);
        if (snippet) snippets.push(snippet);
      }
    }
    
    return snippets;
  } catch (error) {
    console.error('Error getting snippets:', error);
    return [];
  }
}

/**
 * Gets a single snippet by ID
 * @param {Object} kv - KV namespace
 * @param {string} id - Snippet ID
 * @returns {Object|null} Snippet object or null
 */
export async function getSnippet(kv, id) {
  if (!kv || !id) return null;
  
  try {
    const data = await kv.get(`snippet:${id}`);
    return data ? deserializeSnippet(data) : null;
  } catch (error) {
    console.error('Error getting snippet:', error);
    return null;
  }
}

/**
 * Gets a snippet by trigger
 * @param {Object} kv - KV namespace
 * @param {string} trigger - Snippet trigger
 * @returns {Object|null} Snippet object or null
 */
export async function getSnippetByTrigger(kv, trigger) {
  if (!kv || !trigger) return null;
  
  try {
    const list = await kv.list({ prefix: 'snippet:' });
    
    for (const key of list.keys) {
      const data = await kv.get(key.name);
      if (data) {
        const snippet = deserializeSnippet(data);
        if (snippet && snippet.trigger === trigger) {
          return snippet;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting snippet by trigger:', error);
    return null;
  }
}

/**
 * Saves a snippet to KV storage
 * @param {Object} kv - KV namespace
 * @param {Object} snippet - Snippet object
 * @returns {boolean} Success status
 */
export async function saveSnippet(kv, snippet) {
  if (!kv || !snippet || !snippet.id) return false;
  
  try {
    const serialized = serializeSnippet(snippet);
    await kv.put(`snippet:${snippet.id}`, serialized);
    return true;
  } catch (error) {
    console.error('Error saving snippet:', error);
    return false;
  }
}

/**
 * Deletes a snippet from KV storage
 * @param {Object} kv - KV namespace
 * @param {string} id - Snippet ID
 * @returns {boolean} Success status
 */
export async function deleteSnippet(kv, id) {
  if (!kv || !id) return false;
  
  try {
    await kv.delete(`snippet:${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return false;
  }
}

/**
 * Gets all reports from KV storage
 * @param {Object} kv - KV namespace
 * @param {Object} options - Query options
 * @returns {Array} Array of reports
 */
export async function getAllReports(kv, options = {}) {
  if (!kv) return [];
  
  try {
    const { limit = 100, status, modality, bodyRegion } = options;
    const list = await kv.list({ prefix: 'report:', limit });
    const reports = [];
    
    for (const key of list.keys) {
      const data = await kv.get(key.name);
      if (data) {
        const report = deserializeReport(data);
        if (report) {
          // Apply filters
          if (status && report.status !== status) continue;
          if (modality && report.modality !== modality) continue;
          if (bodyRegion && report.bodyRegion !== bodyRegion) continue;
          reports.push(report);
        }
      }
    }
    
    return reports;
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
}

/**
 * Gets a single report by ID
 * @param {Object} kv - KV namespace
 * @param {string} id - Report ID
 * @returns {Object|null} Report object or null
 */
export async function getReport(kv, id) {
  if (!kv || !id) return null;
  
  try {
    const data = await kv.get(`report:${id}`);
    return data ? deserializeReport(data) : null;
  } catch (error) {
    console.error('Error getting report:', error);
    return null;
  }
}

/**
 * Saves a report to KV storage
 * @param {Object} kv - KV namespace
 * @param {Object} report - Report object
 * @returns {boolean} Success status
 */
export async function saveReport(kv, report) {
  if (!kv || !report || !report.id) return false;
  
  try {
    const serialized = serializeReport(report);
    await kv.put(`report:${report.id}`, serialized);
    return true;
  } catch (error) {
    console.error('Error saving report:', error);
    return false;
  }
}

/**
 * Deletes a report from KV storage
 * @param {Object} kv - KV namespace
 * @param {string} id - Report ID
 * @returns {boolean} Success status
 */
export async function deleteReport(kv, id) {
  if (!kv || !id) return false;
  
  try {
    await kv.delete(`report:${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}

/**
 * Gets a session by ID
 * @param {Object} kv - KV namespace
 * @param {string} id - Session ID
 * @returns {Object|null} Session object or null
 */
export async function getSession(kv, id) {
  if (!kv || !id) return null;
  
  try {
    const data = await kv.get(`session:${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Saves a session to KV storage
 * @param {Object} kv - KV namespace
 * @param {Object} session - Session object
 * @param {number} ttl - Time to live in seconds
 * @returns {boolean} Success status
 */
export async function saveSession(kv, session, ttl = 3600) {
  if (!kv || !session || !session.id) return false;
  
  try {
    await kv.put(`session:${session.id}`, JSON.stringify(session), { expirationTtl: ttl });
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
}

/**
 * Deletes a session from KV storage
 * @param {Object} kv - KV namespace
 * @param {string} id - Session ID
 * @returns {boolean} Success status
 */
export async function deleteSession(kv, id) {
  if (!kv || !id) return false;
  
  try {
    await kv.delete(`session:${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

/**
 * Increments usage statistics
 * @param {Object} kv - KV namespace
 * @param {string} key - Usage key
 * @returns {number} New count
 */
export async function incrementUsage(kv, key) {
  if (!kv || !key) return 0;
  
  try {
    const current = await kv.get(`usage:${key}`);
    const count = current ? parseInt(current, 10) + 1 : 1;
    await kv.put(`usage:${key}`, count.toString());
    return count;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return 0;
  }
}

/**
 * Gets usage statistics
 * @param {Object} kv - KV namespace
 * @param {string} key - Usage key
 * @returns {number} Usage count
 */
export async function getUsage(kv, key) {
  if (!kv || !key) return 0;
  
  try {
    const current = await kv.get(`usage:${key}`);
    return current ? parseInt(current, 10) : 0;
  } catch (error) {
    console.error('Error getting usage:', error);
    return 0;
  }
}

/**
 * Searches templates with filters
 * @param {Object} kv - KV namespace
 * @param {Object} filters - Search filters
 * @returns {Array} Matching templates
 */
export async function searchTemplates(kv, filters) {
  const templates = await getAllTemplates(kv);
  
  return templates.filter(template => {
    if (filters.modality && template.modality !== filters.modality) return false;
    if (filters.bodyRegion && template.bodyRegion !== filters.bodyRegion) return false;
    if (filters.system && template.system !== filters.system) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => template.tags.includes(tag));
      if (!hasTag) return false;
    }
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchable = `${template.name} ${template.modality} ${template.bodyRegion} ${template.system}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

/**
 * Searches snippets with filters
 * @param {Object} kv - KV namespace
 * @param {Object} filters - Search filters
 * @returns {Array} Matching snippets
 */
export async function searchSnippets(kv, filters) {
  const snippets = await getAllSnippets(kv);
  
  return snippets.filter(snippet => {
    if (filters.category && snippet.category !== filters.category) return false;
    if (filters.modality && !snippet.modalityTags.includes(filters.modality)) return false;
    if (filters.urgency && snippet.urgency !== filters.urgency) return false;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchable = `${snippet.name} ${snippet.trigger} ${snippet.expansion} ${snippet.keywords.join(' ')}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

/**
 * Gets reports by session ID
 * @param {Object} kv - KV namespace
 * @param {string} sessionId - Session ID
 * @returns {Array} Array of reports
 */
export async function getReportsBySession(kv, sessionId) {
  if (!kv || !sessionId) return [];
  
  const reports = await getAllReports(kv);
  return reports.filter(r => r.sessionId === sessionId);
}

/**
 * Gets reports by date range
 * @param {Object} kv - KV namespace
 * @param {string} startDate - Start date ISO string
 * @param {string} endDate - End date ISO string
 * @returns {Array} Array of reports
 */
export async function getReportsByDateRange(kv, startDate, endDate) {
  const reports = await getAllReports(kv);
  
  return reports.filter(r => {
    const reportDate = new Date(r.createdAt);
    return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
  });
}

/**
 * Gets recent reports
 * @param {Object} kv - KV namespace
 * @param {number} limit - Number of reports
 * @returns {Array} Array of recent reports
 */
export async function getRecentReports(kv, limit = 10) {
  const reports = await getAllReports(kv);
  
  // Sort by createdAt descending
  reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return reports.slice(0, limit);
}

export default {
  getAllTemplates,
  getTemplate,
  saveTemplate,
  deleteTemplate,
  getAllSnippets,
  getSnippet,
  getSnippetByTrigger,
  saveSnippet,
  deleteSnippet,
  getAllReports,
  getReport,
  saveReport,
  deleteReport,
  getSession,
  saveSession,
  deleteSession,
  incrementUsage,
  getUsage,
  searchTemplates,
  searchSnippets,
  getReportsBySession,
  getReportsByDateRange,
  getRecentReports
};