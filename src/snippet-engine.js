/**
 * Snippet Engine Module - Snippet Expansion and Management
 * Part of RadReport AI Engine Components
 */

import { getSnippetByTrigger } from './kv-store.js';
import { searchSnippets as fuzzySearchSnippets } from './fuzzy-search.js';
import { getSnippetData } from './snippet-data.js';

/**
 * Expands a snippet trigger to its full expansion text
 * @param {string} trigger - Snippet trigger (e.g., /lung)
 * @param {Object} kv - KV store for persistence
 * @param {Object} variables - Variables to replace in expansion
 * @returns {Object} Expansion result
 */
export async function expandSnippet(trigger, kv = null, variables = {}) {
  if (!trigger || !trigger.startsWith('/')) {
    return {
      success: false,
      error: 'Invalid trigger format'
    };
  }

  let snippet = null;

  // Try KV storage first if available
  if (kv) {
    snippet = await getSnippetByTrigger(kv, trigger);
  }

  // Fall back to in-memory data
  if (!snippet) {
    const allSnippets = getSnippetData();
    snippet = allSnippets.find(s => s.trigger === trigger);
  }

  if (!snippet) {
    return {
      success: false,
      error: 'Snippet not found'
    };
  }

  // Replace variables in expansion
  let expandedText = snippet.expansion;
  for (const [key, value] of Object.entries(variables)) {
    expandedText = expandedText.split(`{${key}}`).join(value);
  }

  // Track usage
  const usageCount = snippet.usageCount + 1;

  return {
    success: true,
    snippet: {
      ...snippet,
      expandedText,
      usageCount
    }
  };
}

/**
 * Searches snippets by query
 * @param {string} query - Search query
 * @param {Object} kv - KV store
 * @param {Object} filters - Search filters
 * @returns {Array} Matching snippets
 */
export async function searchSnippets(query, kv = null, filters = {}) {
  // Get all snippets
  let snippets = getSnippetData();
  
  // If KV available, merge with stored snippets
  if (kv) {
    // Could add stored snippets here
  }

  // Apply fuzzy search
  const results = fuzzySearchSnippets(snippets, query);

  // Apply additional filters
  let filtered = results.map(r => r.item);
  
  if (filters.category) {
    filtered = filtered.filter(s => s.category === filters.category);
  }
  
  if (filters.modality) {
    filtered = filtered.filter(s => s.modalityTags.includes(filters.modality));
  }
  
  if (filters.urgency) {
    filtered = filtered.filter(s => s.urgency === filters.urgency);
  }

  return filtered;
}

/**
 * Gets snippets by category
 * @param {string} category - Category name
 * @returns {Array} Snippets in category
 */
export function getSnippetsByCategory(category) {
  const snippets = getSnippetData();
  return snippets.filter(s => s.category === category);
}

/**
 * Gets favorite snippets
 * @returns {Array} Favorite snippets
 */
export function getFavoriteSnippets() {
  const snippets = getSnippetData();
  return snippets.filter(s => s.isFavorite);
}

/**
 * Gets default snippets
 * @returns {Array} Default snippets
 */
export function getDefaultSnippets() {
  const snippets = getSnippetData();
  return snippets.filter(s => s.isDefault);
}

/**
 * Gets snippets for a specific modality
 * @param {string} modality - Modality code
 * @returns {Array} Snippets for modality
 */
export function getSnippetsByModality(modality) {
  const snippets = getSnippetData();
  return snippets.filter(s => s.modalityTags.includes(modality));
}

/**
 * Gets snippets for a specific anatomy
 * @param {string} anatomy - Anatomy tag
 * @returns {Array} Snippets for anatomy
 */
export function getSnippetsByAnatomy(anatomy) {
  const snippets = getSnippetData();
  return snippets.filter(s => s.anatomyTags.includes(anatomy));
}

/**
 * Gets urgent snippets
 * @returns {Array} Urgent snippets
 */
export function getUrgentSnippets() {
  const snippets = getSnippetData();
  return snippets.filter(s => s.urgency === 'URGENT' || s.urgency === 'STAT');
}

/**
 * Processes report text and replaces all snippet triggers
 * @param {string} text - Report text with triggers
 * @param {Object} kv - KV store
 * @returns {Object} Processed text with results
 */
export async function processSnippets(text, kv = null) {
  const results = {
    processedText: text,
    replacements: [],
    errors: []
  };

  // Find all triggers in text
  const triggerRegex = /\/[a-zA-Z0-9_]+/g;
  const matches = text.match(triggerRegex);

  if (!matches || matches.length === 0) {
    return results;
  }

  // Process each unique trigger
  const uniqueTriggers = [...new Set(matches)];
  
  for (const trigger of uniqueTriggers) {
    const result = await expandSnippet(trigger, kv);
    
    if (result.success) {
      results.processedText = results.processedText.split(trigger).join(result.snippet.expandedText);
      results.replacements.push({
        trigger,
        expansion: result.snippet.expansion,
        name: result.snippet.name,
        category: result.snippet.category
      });
    } else {
      results.errors.push({
        trigger,
        error: result.error
      });
    }
  }

  return results;
}

/**
 * Gets autocomplete suggestions for triggers
 * @param {string} partial - Partial trigger input
 * @returns {Array} Matching triggers
 */
export function getTriggerSuggestions(partial) {
  if (!partial || !partial.startsWith('/')) {
    return [];
  }

  const snippets = getSnippetData();
  const partialLower = partial.toLowerCase();

  return snippets
    .filter(s => s.trigger.toLowerCase().startsWith(partialLower))
    .map(s => ({
      trigger: s.trigger,
      name: s.name,
      category: s.category
    }))
    .slice(0, 10);
}

/**
 * Gets all available triggers
 * @returns {Array} All snippet triggers
 */
export function getAllTriggers() {
  const snippets = getSnippetData();
  return snippets.map(s => ({
    trigger: s.trigger,
    name: s.name,
    category: s.category
  }));
}

/**
 * Validates snippet trigger
 * @param {string} trigger - Trigger to validate
 * @returns {Object} Validation result
 */
export function validateTrigger(trigger) {
  if (!trigger) {
    return { valid: false, error: 'Trigger is required' };
  }

  if (!trigger.startsWith('/')) {
    return { valid: false, error: 'Trigger must start with /' };
  }

  if (trigger.length < 2) {
    return { valid: false, error: 'Trigger is too short' };
  }

  // Check for valid characters
  const validChars = /^\/[a-zA-Z0-9_]+$/;
  if (!validChars.test(trigger)) {
    return { valid: false, error: 'Trigger contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Creates a new snippet
 * @param {Object} snippetData - Snippet data
 * @returns {Object} Created snippet
 */
export function createSnippet(snippetData) {
  const now = new Date().toISOString();
  
  return {
    id: snippetData.id || `snip_${Date.now()}`,
    trigger: snippetData.trigger,
    expansion: snippetData.expansion,
    name: snippetData.name,
    category: snippetData.category || 'FINDING',
    subcategory: snippetData.subcategory || '',
    keywords: snippetData.keywords || [],
    variables: snippetData.variables || [],
    modalityTags: snippetData.modalityTags || [],
    anatomyTags: snippetData.anatomyTags || [],
    pathologyTags: snippetData.pathologyTags || [],
    urgency: snippetData.urgency || 'ROUTINE',
    ageGroup: snippetData.ageGroup || 'ADULT',
    usageCount: 0,
    isFavorite: snippetData.isFavorite || false,
    isDefault: snippetData.isDefault || false,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Updates snippet usage count
 * @param {Object} snippet - Snippet to update
 * @returns {Object} Updated snippet
 */
export function updateSnippetUsage(snippet) {
  return {
    ...snippet,
    usageCount: (snippet.usageCount || 0) + 1,
    updatedAt: new Date().toISOString()
  };
}

export default {
  expandSnippet,
  searchSnippets,
  getSnippetsByCategory,
  getFavoriteSnippets,
  getDefaultSnippets,
  getSnippetsByModality,
  getSnippetsByAnatomy,
  getUrgentSnippets,
  processSnippets,
  getTriggerSuggestions,
  getAllTriggers,
  validateTrigger,
  createSnippet,
  updateSnippetUsage
};