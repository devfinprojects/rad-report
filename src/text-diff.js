/**
 * Text Diff Module - Text Comparison and Diff Generation
 * Part of RadReport AI Core Utilities
 */

/**
 * Splits text into lines
 * @param {string} text - Text to split
 * @returns {Array} Array of lines
 */
function splitLines(text) {
  if (!text) return [];
  return text.split(/\r?\n/);
}

/**
 * Computes Longest Common Subsequence
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} LCS array
 */
function computeLCS(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  const lcs = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return lcs;
}

/**
 * Generates line-by-line diff
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @returns {Array} Array of diff operations
 */
export function generateLineDiff(oldText, newText) {
  const oldLines = splitLines(oldText);
  const newLines = splitLines(newText);
  const lcs = computeLCS(oldLines, newLines);
  
  const result = [];
  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && oldLines[oldIdx] === lcs[lcsIdx] &&
        newIdx < newLines.length && newLines[newIdx] === lcs[lcsIdx]) {
      result.push({ type: 'equal', value: oldLines[oldIdx] });
      oldIdx++;
      newIdx++;
      lcsIdx++;
    } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
      result.push({ type: 'removed', value: oldLines[oldIdx] });
      oldIdx++;
    } else if (newIdx < newLines.length && (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])) {
      result.push({ type: 'added', value: newLines[newIdx] });
      newIdx++;
    } else {
      break;
    }
  }
  
  return result;
}

/**
 * Generates character-level diff within a line
 * @param {string} oldLine - Original line
 * @param {string} newLine - New line
 * @returns {Array} Array of character diff operations
 */
export function generateCharDiff(oldLine, newLine) {
  if (!oldLine && !newLine) return [];
  if (!oldLine) return [{ type: 'added', value: newLine }];
  if (!newLine) return [{ type: 'removed', value: oldLine }];
  
  const result = [];
  let i = 0, j = 0;
  
  while (i < oldLine.length || j < newLine.length) {
    if (i < oldLine.length && j < newLine.length && oldLine[i] === newLine[j]) {
      result.push({ type: 'equal', value: oldLine[i] });
      i++;
      j++;
    } else if (i < oldLine.length && (j >= newLine.length || 
               oldLine.substring(i).indexOf(newLine[j]) !== -1 ||
               newLine.substring(j).indexOf(oldLine[i]) !== -1)) {
      // Check if this is a modification or deletion
      if (j < newLine.length) {
        result.push({ type: 'modified', oldValue: oldLine[i], newValue: newLine[j] });
        i++;
        j++;
      } else {
        result.push({ type: 'removed', value: oldLine[i] });
        i++;
      }
    } else if (j < newLine.length) {
      result.push({ type: 'added', value: newLine[j] });
      j++;
    }
  }
  
  return result;
}

/**
 * Computes similarity ratio between two texts
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Similarity ratio (0-1)
 */
export function computeTextSimilarity(text1, text2) {
  if (!text1 && !text2) return 1;
  if (!text1 || !text2) return 0;
  
  const lines1 = splitLines(text1);
  const lines2 = splitLines(text2);
  const lcs = computeLCS(lines1, lines2);
  
  const totalLength = lines1.length + lines2.length;
  if (totalLength === 0) return 1;
  
  return (2 * lcs.length) / totalLength;
}

/**
 * Gets word-level differences
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @returns {Array} Array of word diff operations
 */
export function getWordDiff(oldText, newText) {
  const oldWords = oldText ? oldText.split(/\s+/) : [];
  const newWords = newText ? newText.split(/\s+/) : [];
  
  const lcs = computeLCS(oldWords, newWords);
  
  const result = [];
  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;
  
  while (oldIdx < oldWords.length || newIdx < newWords.length) {
    if (lcsIdx < lcs.length && oldIdx < oldWords.length && oldWords[oldIdx] === lcs[lcsIdx] &&
        newIdx < newWords.length && newWords[newIdx] === lcs[lcsIdx]) {
      result.push({ type: 'equal', value: oldWords[oldIdx] });
      oldIdx++;
      newIdx++;
      lcsIdx++;
    } else if (oldIdx < oldWords.length && (lcsIdx >= lcs.length || oldWords[oldIdx] !== lcs[lcsIdx])) {
      result.push({ type: 'removed', value: oldWords[oldIdx] });
      oldIdx++;
    } else if (newIdx < newWords.length && (lcsIdx >= lcs.length || newWords[newIdx] !== lcs[lcsIdx])) {
      result.push({ type: 'added', value: newWords[newIdx] });
      newIdx++;
    }
  }
  
  return result;
}

/**
 * Creates unified diff format
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @param {Object} options - Diff options
 * @returns {string} Unified diff string
 */
export function createUnifiedDiff(oldText, newText, options = {}) {
  const {
    oldHeader = 'Original',
    newHeader = 'Modified',
    context = 3
  } = options;
  
  const diff = generateLineDiff(oldText, newText);
  const lines = [];
  
  lines.push(`--- ${oldHeader}`);
  lines.push(`+++ ${newHeader}`);
  
  let oldLineNum = 1;
  let newLineNum = 1;
  
  for (const op of diff) {
    switch (op.type) {
      case 'equal':
        lines.push(` ${op.value}`);
        oldLineNum++;
        newLineNum++;
        break;
      case 'removed':
        lines.push(`-${op.value}`);
        oldLineNum++;
        break;
      case 'added':
        lines.push(`+${op.value}`);
        newLineNum++;
        break;
    }
  }
  
  return lines.join('\n');
}

/**
 * Creates side-by-side diff view
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @returns {Object} Side-by-side diff
 */
export function createSideBySideDiff(oldText, newText) {
  const diff = generateLineDiff(oldText, newText);
  
  const left = [];
  const right = [];
  let leftLineNum = 1;
  let rightLineNum = 1;
  
  for (const op of diff) {
    switch (op.type) {
      case 'equal':
        left.push({ lineNum: leftLineNum++, text: op.value });
        right.push({ lineNum: rightLineNum++, text: op.value });
        break;
      case 'removed':
        left.push({ lineNum: leftLineNum++, text: op.value, type: 'removed' });
        right.push({ lineNum: '', text: '', type: 'empty' });
        break;
      case 'added':
        left.push({ lineNum: '', text: '', type: 'empty' });
        right.push({ lineNum: rightLineNum++, text: op.value, type: 'added' });
        break;
    }
  }
  
  return { left, right };
}

/**
 * Gets statistics about the diff
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @returns {Object} Diff statistics
 */
export function getDiffStats(oldText, newText) {
  const diff = generateLineDiff(oldText, newText);
  
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  
  for (const op of diff) {
    switch (op.type) {
      case 'added':
        added++;
        break;
      case 'removed':
        removed++;
        break;
      case 'equal':
        unchanged++;
        break;
    }
  }
  
  const total = added + removed + unchanged;
  const changePercent = total > 0 ? ((added + removed) / total * 100).toFixed(1) : 0;
  
  return {
    added,
    removed,
    unchanged,
    total,
    changePercent
  };
}

/**
 * Applies a patch to text
 * @param {string} original - Original text
 * @param {string} patch - Patch string
 * @returns {string} Patched text
 */
export function applyPatch(original, patch) {
  const originalLines = splitLines(original);
  const patchLines = splitLines(patch);
  
  const result = [];
  let origIdx = 0;
  
  for (const line of patchLines) {
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
      continue;
    } else if (line.startsWith('+')) {
      result.push(line.substring(1));
    } else if (line.startsWith('-')) {
      origIdx++;
    } else if (line.startsWith(' ') || (line && !line.startsWith('+'))) {
      result.push(line.startsWith(' ') ? line.substring(1) : line);
      origIdx++;
    }
  }
  
  // Add any remaining original lines
  while (origIdx < originalLines.length) {
    result.push(originalLines[origIdx]);
    origIdx++;
  }
  
  return result.join('\n');
}

/**
 * Creates HTML-formatted diff
 * @param {string} oldText - Original text
 * @param {string} newText - New text
 * @returns {string} HTML diff
 */
export function createHtmlDiff(oldText, newText) {
  const diff = generateLineDiff(oldText, newText);
  const html = [];
  
  html.push('<div class="diff-container">');
  
  for (const op of diff) {
    const escapedValue = (op.value || '').replace(/&/g, '&')
                                            .replace(/</g, '<')
                                            .replace(/>/g, '>');
    
    switch (op.type) {
      case 'added':
        html.push(`<div class="diff-added">+ ${escapedValue}</div>`);
        break;
      case 'removed':
        html.push(`<div class="diff-removed">- ${escapedValue}</div>`);
        break;
      case 'equal':
        html.push(`<div class="diff-equal">  ${escapedValue}</div>`);
        break;
    }
  }
  
  html.push('</div>');
  return html.join('\n');
}

export default {
  generateLineDiff,
  generateCharDiff,
  computeTextSimilarity,
  getWordDiff,
  createUnifiedDiff,
  createSideBySideDiff,
  getDiffStats,
  applyPatch,
  createHtmlDiff
};