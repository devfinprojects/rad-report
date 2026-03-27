/**
 * Fuzzy Functions Module - Advanced Fuzzy Logic Functions
 * Part of RadReport AI Frontend
 */

/**
 * Calculates weighted fuzzy match score
 * @param {string} text - Text to match
 * @param {string} query - Query string
 * @param {Object} weights - Custom weights
 * @returns {number} Weighted score (0-1)
 */
export function weightedFuzzyMatch(text, query, weights = {}) {
  const defaults = {
    exact: 1.0,
    startsWith: 0.9,
    contains: 0.7,
    tokens: 0.6,
    levenshtein: 0.5
  };
  
  const w = { ...defaults, ...weights };
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let maxScore = 0;
  
  // Exact match
  if (textLower === queryLower) {
    maxScore = w.exact;
  }
  // Starts with
  else if (textLower.startsWith(queryLower)) {
    maxScore = w.startsWith;
  }
  // Contains
  else if (textLower.includes(queryLower)) {
    maxScore = w.contains;
  }
  
  // Token match
  const textTokens = textLower.split(/[\s\-_,;.:()[\]{}]+/);
  const queryTokens = queryLower.split(/[\s\-_,;.:()[\]{}]+/);
  let tokenScore = 0;
  
  for (const qt of queryTokens) {
    for (const tt of textTokens) {
      if (tt.includes(qt) || qt.includes(tt)) {
        tokenScore = Math.max(tokenScore, 0.8);
      } else {
        const similarity = calculateSimilarity(qt, tt);
        tokenScore = Math.max(tokenScore, similarity * w.levenshtein);
      }
    }
  }
  
  maxScore = Math.max(maxScore, tokenScore * w.tokens);
  
  return maxScore;
}

/**
 * Calculates similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity (0-1)
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = levenshteinDistance(str1, str2);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance calculation
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Distance
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Performs multi-field fuzzy search
 * @param {Array} items - Items to search
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search
 * @param {Object} options - Search options
 * @returns {Array} Search results with scores
 */
export function multiFieldFuzzySearch(items, query, fields, options = {}) {
  const { threshold = 0.3, limit = 20 } = options;
  
  if (!items || !query || !fields || fields.length === 0) {
    return [];
  }
  
  const results = [];
  
  for (const item of items) {
    let bestScore = 0;
    let matchedField = null;
    
    for (const field of fields) {
      const value = item[field];
      if (!value) continue;
      
      const score = weightedFuzzyMatch(value.toString(), query);
      
      if (score > bestScore) {
        bestScore = score;
        matchedField = field;
      }
    }
    
    if (bestScore >= threshold) {
      results.push({
        item,
        score: bestScore,
        field: matchedField
      });
    }
  }
  
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}

/**
 * Creates a fuzzy autocomplete function
 * @param {Array} items - Items for autocomplete
 * @param {string} displayKey - Key to display
 * @param {Function} filterFn - Optional filter function
 * @returns {Function} Autocomplete function
 */
export function createAutocomplete(items, displayKey = 'name', filterFn = null) {
  const filtered = filterFn ? items.filter(filterFn) : items;
  
  return (query, options = {}) => {
    const { limit = 10, threshold = 0.2 } = options;
    
    if (!query) {
      return filtered.slice(0, limit).map(item => ({
        item,
        label: item[displayKey],
        value: item
      }));
    }
    
    const results = filtered.map(item => ({
      item,
      label: item[displayKey],
      score: weightedFuzzyMatch(item[displayKey], query)
    }));
    
    return results
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({ ...r, value: r.item }));
  };
}

/**
 * Performs fuzzy filtering on array
 * @param {Array} items - Items to filter
 * @param {string} query - Filter query
 * @param {Function|string|Array} keys - Key(s) to filter on
 * @returns {Array} Filtered items
 */
export function fuzzyFilter(items, query, keys) {
  if (!query || !keys) return items;
  
  const keyArray = Array.isArray(keys) ? keys : [keys];
  const queryLower = query.toLowerCase();
  
  return items.filter(item => {
    for (const key of keyArray) {
      const value = typeof key === 'function' ? key(item) : item[key];
      if (value && value.toString().toLowerCase().includes(queryLower)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Ranks search results by relevance
 * @param {Array} results - Search results
 * @param {string} query - Original query
 * @param {Function} scoreFn - Custom scoring function
 * @returns {Array} Ranked results
 */
export function rankResults(results, query, scoreFn = null) {
  if (!results || results.length === 0) return [];
  
  const queryTokens = query.toLowerCase().split(/[\s\-_,;.:()[\]{}]+/).filter(t => t.length > 0);
  
  const scored = results.map(result => {
    let score = result.score || 0;
    
    // Boost exact matches
    if (scoreFn) {
      score += scoreFn(result);
    }
    
    // Token penalty
    if (queryTokens.length > 1 && result.item) {
      const itemStr = JSON.stringify(result.item).toLowerCase();
      const matchedTokens = queryTokens.filter(t => itemStr.includes(t));
      const tokenPenalty = (queryTokens.length - matchedTokens.length) / queryTokens.length;
      score -= tokenPenalty * 0.1;
    }
    
    return { ...result, finalScore: Math.max(0, score) };
  });
  
  return scored.sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Highlights matched text
 * @param {string} text - Original text
 * @param {string} query - Search query
 * @param {string} highlightTag - HTML tag to use
 * @returns {string} Highlighted text
 */
export function highlightMatches(text, query, highlightTag = 'mark') {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, `<${highlightTag}>$1</${highlightTag}>`);
}

/**
 * Escapes special regex characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generates search suggestions
 * @param {Array} items - Items to analyze
 * @param {string} query - Current query
 * @param {string} key - Key to extract suggestions from
 * @param {number} limit - Max suggestions
 * @returns {Array} Suggestions
 */
export function getSuggestions(items, query, key = 'name', limit = 5) {
  if (!items || !query || !key) return [];
  
  const queryLower = query.toLowerCase();
  const suggestions = new Set();
  
  for (const item of items) {
    const value = item[key];
    if (!value) continue;
    
    const valueLower = value.toLowerCase();
    
    // Add completions
    if (valueLower.startsWith(queryLower) && suggestions.size < limit) {
      suggestions.add(value);
    }
    
    // Add partial matches
    if (valueLower.includes(queryLower)) {
      const parts = valueLower.split(queryLower);
      if (parts.length > 1 && suggestions.size < limit) {
        suggestions.add(value);
      }
    }
  }
  
  return Array.from(suggestions).slice(0, limit);
}

/**
 * Performs phonetic fuzzy matching
 * @param {string} text - Text to match
 * @param {string} query - Query text
 * @returns {number} Phonetic similarity (0-1)
 */
export function phoneticMatch(text, query) {
  if (!text || !query) return 0;
  
  const soundex1 = getSoundex(text);
  const soundex2 = getSoundex(query);
  
  if (soundex1 === soundex2) return 1;
  
  // Calculate similarity of soundex codes
  let matches = 0;
  for (let i = 0; i < 4; i++) {
    if (soundex1[i] === soundex2[i]) matches++;
  }
  
  return matches / 4;
}

/**
 * Generates Soundex code for a string
 * @param {string} str - String to encode
 * @returns {string} Soundex code
 */
function getSoundex(str) {
  const a = str.toLowerCase().split('');
  const f = a.shift();
  let codes = '';
  
  const mapping = {
    a: 0, e: 0, i: 0, o: 0, u: 0, h: 0, w: 0, y: 0,
    b: 1, f: 1, p: 1, v: 1,
    c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
    d: 3, t: 3,
    l: 4,
    m: 5, n: 5,
    r: 6
  };
  
  for (const char of a) {
    const code = mapping[char];
    if (code !== undefined && code !== 0) {
      codes += code;
    }
  }
  
  return (f + codes).padEnd(4, '0').substring(0, 4).toUpperCase();
}

/**
 * Calculates word-level fuzzy match
 * @param {string} text - Text to match
 * @param {string} query - Query text
 * @returns {number} Word-level score (0-1)
 */
export function wordFuzzyMatch(text, query) {
  if (!text || !query) return 0;
  
  const textWords = text.toLowerCase().split(/[\s\-_,;.:()[\]{}]+/).filter(w => w.length > 0);
  const queryWords = query.toLowerCase().split(/[\s\-_,;.:()[\]{}]+/).filter(w => w.length > 0);
  
  if (queryWords.length === 0) return 0;
  
  let matches = 0;
  
  for (const qw of queryWords) {
    for (const tw of textWords) {
      if (tw === qw) {
        matches += 1;
        break;
      } else if (tw.includes(qw) || qw.includes(tw)) {
        matches += 0.8;
        break;
      } else {
        const similarity = calculateSimilarity(tw, qw);
        if (similarity > 0.5) {
          matches += similarity;
          break;
        }
      }
    }
  }
  
  return matches / queryWords.length;
}

/**
 * Fuzzy sorts an array
 * @param {Array} array - Array to sort
 * @param {string} query - Sort query
 * @param {string|Function} key - Key to sort by
 * @returns {Array} Sorted array
 */
export function fuzzySort(array, query, key) {
  if (!array || !query) return array;
  
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    const aScore = weightedFuzzyMatch(aVal.toString(), query);
    const bScore = weightedFuzzyMatch(bVal.toString(), query);
    
    return bScore - aScore;
  });
}

export default {
  weightedFuzzyMatch,
  calculateSimilarity,
  multiFieldFuzzySearch,
  createAutocomplete,
  fuzzyFilter,
  rankResults,
  highlightMatches,
  getSuggestions,
  phoneticMatch,
  wordFuzzyMatch,
  fuzzySort
};