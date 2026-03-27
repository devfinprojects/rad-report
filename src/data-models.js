/**
 * Data Models Module - Schema Definitions
 * Part of RadReport AI Data Layer
 */

/**
 * Creates a new template data model
 * @param {Object} data - Template data
 * @returns {Object} Template object
 */
export function createTemplate(data) {
  return {
    id: data.id || null,
    modality: data.modality || null,
    system: data.system || null,
    name: data.name || null,
    bodyRegion: data.bodyRegion || null,
    templateText: data.templateText || '',
    normalDefaults: data.normalDefaults || '',
    normalReport: data.normalReport || '',
    anatomyChecklist: data.anatomyChecklist || [],
    tags: data.tags || [],
    isDefault: data.isDefault || false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}

/**
 * Creates a new snippet data model
 * @param {Object} data - Snippet data
 * @returns {Object} Snippet object
 */
export function createSnippet(data) {
  return {
    id: data.id || null,
    trigger: data.trigger || null,
    expansion: data.expansion || null,
    name: data.name || null,
    category: data.category || null,
    subcategory: data.subcategory || null,
    keywords: data.keywords || [],
    variables: data.variables || [],
    modalityTags: data.modalityTags || [],
    anatomyTags: data.anatomyTags || [],
    pathologyTags: data.pathologyTags || [],
    urgency: data.urgency || 'ROUTINE',
    ageGroup: data.ageGroup || 'ADULT',
    usageCount: data.usageCount || 0,
    isFavorite: data.isFavorite || false,
    isDefault: data.isDefault || false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}

/**
 * Creates a new report data model
 * @param {Object} data - Report data
 * @returns {Object} Report object
 */
export function createReport(data) {
  return {
    id: data.id || null,
    sessionId: data.sessionId || null,
    patientName: data.patientName || null,
    mrn: data.mrn || null,
    accessionNumber: data.accessionNumber || null,
    dob: data.dob || null,
    gender: data.gender || null,
    modality: data.modality || null,
    bodyRegion: data.bodyRegion || null,
    system: data.system || null,
    clinicalHistory: data.clinicalHistory || '',
    technique: data.technique || '',
    findings: data.findings || '',
    impression: data.impression || '',
    comparisonStudy: data.comparisonStudy || null,
    status: data.status || 'DRAFT',
    urgency: data.urgency || 'ROUTINE',
    templateId: data.templateId || null,
    snippetIds: data.snippetIds || [],
    version: data.version || 1,
    previousVersion: data.previousVersion || null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    signedAt: data.signedAt || null,
    signedBy: data.signedBy || null,
    addendums: data.addendums || []
  };
}

/**
 * Creates a new session data model
 * @param {Object} data - Session data
 * @returns {Object} Session object
 */
export function createSession(data) {
  return {
    id: data.id || null,
    userId: data.userId || null,
    reportId: data.reportId || null,
    createdAt: data.createdAt || new Date().toISOString(),
    expiredAt: data.expiredAt || null,
    lastActivity: data.lastActivity || new Date().toISOString(),
    data: data.data || {},
    metadata: data.metadata || {}
  };
}

/**
 * Creates a user profile data model
 * @param {Object} data - User data
 * @returns {Object} User object
 */
export function createUser(data) {
  return {
    id: data.id || null,
    username: data.username || null,
    email: data.email || null,
    role: data.role || 'RADIOLOGIST',
    preferences: data.preferences || {},
    createdAt: data.createdAt || new Date().toISOString(),
    lastLogin: data.lastLogin || null
  };
}

/**
 * Creates an addendum data model
 * @param {Object} data - Addendum data
 * @returns {Object} Addendum object
 */
export function createAddendum(data) {
  return {
    id: data.id || null,
    reportId: data.reportId || null,
    type: data.type || 'CLARIFICATION',
    content: data.content || '',
    reason: data.reason || '',
    createdAt: data.createdAt || new Date().toISOString(),
    createdBy: data.createdBy || null
  };
}

/**
 * Creates a followup recommendation data model
 * @param {Object} data - Followup data
 * @returns {Object} Followup object
 */
export function createFollowup(data) {
  return {
    id: data.id || null,
    reportId: data.reportId || null,
    findingId: data.findingId || null,
    modality: data.modality || null,
    timeframe: data.timeframe || null,
    reason: data.reason || '',
    notes: data.notes || '',
    createdAt: data.createdAt || new Date().toISOString()
  };
}

/**
 * Creates a measurement data model
 * @param {Object} data - Measurement data
 * @returns {Object} Measurement object
 */
export function createMeasurement(data) {
  return {
    id: data.id || null,
    reportId: data.reportId || null,
    findingId: data.findingId || null,
    type: data.type || 'SIZE',
    value: data.value || null,
    unit: data.unit || 'mm',
    location: data.location || '',
    description: data.description || '',
    createdAt: data.createdAt || new Date().toISOString()
  };
}

/**
 * Creates an anatomy checklist item
 * @param {Object} data - Checklist data
 * @returns {Object} Checklist item
 */
export function createChecklistItem(data) {
  return {
    id: data.id || null,
    name: data.name || null,
    description: data.description || '',
    isNormal: data.isNormal || true,
    findings: data.findings || '',
    checked: data.checked || false
  };
}

/**
 * Creates a dashboard metrics data model
 * @param {Object} data - Metrics data
 * @returns {Object} Metrics object
 */
export function createDashboardMetrics(data) {
  return {
    id: data.id || null,
    period: data.period || 'DAILY',
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    totalReports: data.totalReports || 0,
    reportsByModality: data.reportsByModality || {},
    reportsByStatus: data.reportsByStatus || {},
    averageReportLength: data.averageReportLength || 0,
    topTemplates: data.topTemplates || [],
    topSnippets: data.topSnippets || [],
    userActivity: data.userActivity || [],
    createdAt: data.createdAt || new Date().toISOString()
  };
}

/**
 * Creates a search filter data model
 * @param {Object} data - Filter data
 * @returns {Object} Filter object
 */
export function createSearchFilter(data) {
  return {
    modality: data.modality || null,
    bodyRegion: data.bodyRegion || null,
    system: data.system || null,
    status: data.status || null,
    urgency: data.urgency || null,
    dateRange: data.dateRange || null,
    tags: data.tags || [],
    query: data.query || null
  };
}

/**
 * Creates a pagination data model
 * @param {Object} data - Pagination data
 * @returns {Object} Pagination object
 */
export function createPagination(data) {
  return {
    page: data.page || 1,
    limit: data.limit || 20,
    total: data.total || 0,
    totalPages: data.totalPages || 0,
    hasNext: data.hasNext || false,
    hasPrev: data.hasPrev || false
  };
}

/**
 * Creates an API response wrapper
 * @param {Object} data - Response data
 * @returns {Object} Response object
 */
export function createApiResponse(data, error = null) {
  return {
    success: !error,
    data: data || null,
    error: error ? {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An error occurred',
      details: error.details || null
    } : null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates a list response with pagination
 * @param {Array} items - Array of items
 * @param {Object} pagination - Pagination info
 * @returns {Object} List response
 */
export function createListResponse(items, pagination) {
  return {
    items,
    pagination: createPagination({
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page * pagination.limit < pagination.total,
      hasPrev: pagination.page > 1
    })
  };
}

/**
 * Validates a template object
 * @param {Object} template - Template to validate
 * @returns {Object} Validation result
 */
export function validateTemplateModel(template) {
  const errors = [];
  
  if (!template.id) errors.push('ID is required');
  if (!template.modality) errors.push('Modality is required');
  if (!template.name) errors.push('Name is required');
  if (!template.templateText) errors.push('Template text is required');
  if (!template.bodyRegion) errors.push('Body region is required');
  if (!Array.isArray(template.anatomyChecklist)) errors.push('Anatomy checklist must be an array');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a snippet object
 * @param {Object} snippet - Snippet to validate
 * @returns {Object} Validation result
 */
export function validateSnippetModel(snippet) {
  const errors = [];
  
  if (!snippet.id) errors.push('ID is required');
  if (!snippet.trigger) errors.push('Trigger is required');
  if (!snippet.name) errors.push('Name is required');
  if (!snippet.expansion) errors.push('Expansion is required');
  if (!snippet.category) errors.push('Category is required');
  if (snippet.trigger && !snippet.trigger.startsWith('/')) {
    errors.push('Trigger must start with /');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a report object
 * @param {Object} report - Report to validate
 * @returns {Object} Validation result
 */
export function validateReportModel(report) {
  const errors = [];
  
  if (!report.id) errors.push('ID is required');
  if (!report.modality) errors.push('Modality is required');
  if (!report.bodyRegion) errors.push('Body region is required');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Converts template to storage format
 * @param {Object} template - Template object
 * @returns {string} JSON string
 */
export function serializeTemplate(template) {
  return JSON.stringify(template);
}

/**
 * Converts storage format to template
 * @param {string} json - JSON string
 * @returns {Object} Template object
 */
export function deserializeTemplate(json) {
  try {
    return createTemplate(JSON.parse(json));
  } catch (e) {
    return null;
  }
}

/**
 * Converts snippet to storage format
 * @param {Object} snippet - Snippet object
 * @returns {string} JSON string
 */
export function serializeSnippet(snippet) {
  return JSON.stringify(snippet);
}

/**
 * Converts storage format to snippet
 * @param {string} json - JSON string
 * @returns {Object} Snippet object
 */
export function deserializeSnippet(json) {
  try {
    return createSnippet(JSON.parse(json));
  } catch (e) {
    return null;
  }
}

/**
 * Converts report to storage format
 * @param {Object} report - Report object
 * @returns {string} JSON string
 */
export function serializeReport(report) {
  return JSON.stringify(report);
}

/**
 * Converts storage format to report
 * @param {string} json - JSON string
 * @returns {Object} Report object
 */
export function deserializeReport(json) {
  try {
    return createReport(JSON.parse(json));
  } catch (e) {
    return null;
  }
}

/**
 * Updates template timestamp
 * @param {Object} template - Template object
 * @returns {Object} Updated template
 */
export function updateTemplateTimestamp(template) {
  return {
    ...template,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Updates snippet timestamp
 * @param {Object} snippet - Snippet object
 * @returns {Object} Updated snippet
 */
export function updateSnippetTimestamp(snippet) {
  return {
    ...snippet,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Updates report timestamp
 * @param {Object} report - Report object
 * @returns {Object} Updated report
 */
export function updateReportTimestamp(report) {
  return {
    ...report,
    updatedAt: new Date().toISOString()
  };
}

export default {
  createTemplate,
  createSnippet,
  createReport,
  createSession,
  createUser,
  createAddendum,
  createFollowup,
  createMeasurement,
  createChecklistItem,
  createDashboardMetrics,
  createSearchFilter,
  createPagination,
  createApiResponse,
  createListResponse,
  validateTemplateModel,
  validateSnippetModel,
  validateReportModel,
  serializeTemplate,
  deserializeTemplate,
  serializeSnippet,
  deserializeSnippet,
  serializeReport,
  deserializeReport,
  updateTemplateTimestamp,
  updateSnippetTimestamp,
  updateReportTimestamp
};