/**
 * Fuzzy Search Module - Approximate String Matching
 * Part of RadReport AI Core Utilities
 */

/**
 * Calculates Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  if (!str1 || str1.length === 0) return str2 ? str2.length : 0;
  if (!str2 || str2.length === 0) return str1.length;
  
  const matrix = [];
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[str1.length][str2.length];
}

/**
 * Calculates Levenshtein similarity ratio (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity ratio
 */
export function levenshteinSimilarity(str1, str2) {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - (distance / maxLength);
}

/**
 * Tokenizes string into words
 * @param {string} str - String to tokenize
 * @returns {Array} Array of tokens
 */
function tokenize(str) {
  if (!str) return [];
  return str.toLowerCase().split(/[\s\-_,;.:()[\]{}]+/).filter(t => t.length > 0);
}

/**
 * Calculates Jaccard similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Jaccard similarity (0-1)
 */
export function jaccardSimilarity(str1, str2) {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  
  const tokens1 = new Set(tokenize(str1));
  const tokens2 = new Set(tokenize(str2));
  
  if (tokens1.size === 0 && tokens2.size === 0) return 1;
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  return intersection.size / union.size;
}

/**
 * Calculates Dice coefficient between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Dice coefficient (0-1)
 */
export function diceCoefficient(str1, str2) {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  
  const tokens1 = tokenize(str1);
  const tokens2 = tokenize(str2);
  
  if (tokens1.length === 0 && tokens2.length === 0) return 1;
  
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  let matches = 0;
  for (const token of set1) {
    if (set2.has(token)) matches++;
  }
  
  return (2 * matches) / (set1.size + set2.size);
}

/**
 * Checks if string contains substring (case-insensitive)
 * @param {string} str - Main string
 * @param {string} substr - Substring to find
 * @returns {boolean} True if contains
 */
export function containsIgnoreCase(str, substr) {
  if (!str || !substr) return false;
  return str.toLowerCase().includes(substr.toLowerCase());
}

/**
 * Checks if string starts with substring (case-insensitive)
 * @param {string} str - Main string
 * @param {string} substr - Substring to check
 * @returns {boolean} True if starts with
 */
export function startsWithIgnoreCase(str, substr) {
  if (!str || !substr) return false;
  return str.toLowerCase().startsWith(substr.toLowerCase());
}

/**
 * Checks if string ends with substring (case-insensitive)
 * @param {string} str - Main string
 * @param {string} substr - Substring to check
 * @returns {boolean} True if ends with
 */
export function endsWithIgnoreCase(str, substr) {
  if (!str || !substr) return false;
  return str.toLowerCase().endsWith(substr.toLowerCase());
}

/**
 * Performs fuzzy search on array of items
 * @param {Array} items - Array of items to search
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Matched items with scores
 */
export function fuzzySearch(items, query, options = {}) {
  if (!items || !Array.isArray(items) || !query) return [];
  
  const {
    threshold = 0.3,
    keys = ['name'],
    limit = 20,
    useLevenshtein = true,
    useJaccard = true
  } = options;
  
  const queryLower = query.toLowerCase().trim();
  const queryTokens = tokenize(query);
  
  const results = [];
  
  for (const item of items) {
    let bestScore = 0;
    let matchedKey = null;
    
    for (const key of keys) {
      const value = typeof item === 'string' ? item : item[key];
      if (!value) continue;
      
      const valueLower = value.toLowerCase();
      
      // Exact match gets highest score
      if (valueLower === queryLower) {
        bestScore = 1;
        matchedKey = key;
        break;
      }
      
      // Starts with match
      if (valueLower.startsWith(queryLower)) {
        bestScore = Math.max(bestScore, 0.9);
        matchedKey = key;
      }
      
      // Contains match
      if (valueLower.includes(queryLower)) {
        bestScore = Math.max(bestScore, 0.7);
        matchedKey = key;
      }
      
      // Token match
      const itemTokens = tokenize(value);
      for (const qt of queryTokens) {
        for (const it of itemTokens) {
          if (it.includes(qt) || qt.includes(it)) {
            bestScore = Math.max(bestScore, 0.6);
          }
        }
      }
      
      // Fuzzy matching
      if (useLevenshtein) {
        const levScore = levenshteinSimilarity(query, value);
        bestScore = Math.max(bestScore, levScore * 0.8);
      }
      
      if (useJaccard) {
        const jacScore = jaccardSimilarity(query, value);
        bestScore = Math.max(bestScore, jacScore * 0.7);
      }
    }
    
    if (bestScore >= threshold) {
      results.push({
        item,
        score: bestScore,
        key: matchedKey
      });
    }
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}

/**
 * Searches templates by query
 * @param {Array} templates - Array of templates
 * @param {string} query - Search query
 * @returns {Array} Matched templates
 */
export function searchTemplates(templates, query) {
  return fuzzySearch(templates, query, {
    threshold: 0.2,
    keys: ['name', 'modality', 'bodyRegion', 'system', 'tags'],
    limit: 50
  });
}

/**
 * Searches snippets by query
 * @param {Array} snippets - Array of snippets
 * @param {string} query - Search query
 * @returns {Array} Matched snippets
 */
export function searchSnippets(snippets, query) {
  return fuzzySearch(snippets, query, {
    threshold: 0.2,
    keys: ['name', 'trigger', 'expansion', 'keywords', 'category'],
    limit: 50
  });
}

/**
 * Searches reports by query
 * @param {Array} reports - Array of reports
 * @param {string} query - Search query
 * @returns {Array} Matched reports
 */
export function searchReports(reports, query) {
  return fuzzySearch(reports, query, {
    threshold: 0.2,
    keys: ['patientName', 'mrn', 'accessionNumber', 'findings', 'impression'],
    limit: 50
  });
}

/**
 * Performs prefix matching
 * @param {string} str - String to match
 * @param {string} prefix - Prefix to check
 * @returns {boolean} True if matches prefix
 */
export function matchesPrefix(str, prefix) {
  if (!str || !prefix) return false;
  return str.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * Gets matching prefix suggestions
 * @param {Array} items - Array of strings to match against
 * @param {string} prefix - Prefix to match
 * @param {number} limit - Max suggestions
 * @returns {Array} Matching suggestions
 */
export function getPrefixSuggestions(items, prefix, limit = 10) {
  if (!items || !Array.isArray(items) || !prefix) return [];
  
  const prefixLower = prefix.toLowerCase();
  const matches = items
    .filter(item => typeof item === 'string' && item.toLowerCase().startsWith(prefixLower))
    .slice(0, limit);
  
  return matches.sort();
}

/**
 * Calculates Sørensen-Dice coefficient for bigrams
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Coefficient (0-1)
 */
export function bigramDice(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const getBigrams = (str) => {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };
  
  const bigrams1 = getBigrams(str1.toLowerCase());
  const bigrams2 = getBigrams(str2.toLowerCase());
  
  if (bigrams1.size === 0 && bigrams2.size === 0) return 1;
  
  let matches = 0;
  for (const bg of bigrams1) {
    if (bigrams2.has(bg)) matches++;
  }
  
  return (2 * matches) / (bigrams1.size + bigrams2.size);
}

/**
 * Performs spell correction suggestion
 * @param {string} word - Word to correct
 * @param {Array} dictionary - Valid words
 * @returns {string|null} Suggested correction or null
 */
export function suggestCorrection(word, dictionary) {
  if (!word || !dictionary || dictionary.length === 0) return null;
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const dictWord of dictionary) {
    const score = levenshteinSimilarity(word, dictWord);
    if (score > bestScore && score > 0.6) {
      bestScore = score;
      bestMatch = dictWord;
    }
  }
  
  return bestMatch;
}

export default {
  levenshteinDistance,
  levenshteinSimilarity,
  jaccardSimilarity,
  diceCoefficient,
  containsIgnoreCase,
  startsWithIgnoreCase,
  endsWithIgnoreCase,
  fuzzySearch,
  searchTemplates,
  searchSnippets,
  searchReports,
  matchesPrefix,
  getPrefixSuggestions,
  bigramDice,
  suggestCorrection
};