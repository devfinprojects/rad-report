/**
 * Followup Extractor Module - Extract and Generate Followup Recommendations
 * Part of RadReport AI Engine Components
 */

/**
 * Extracts findings that require followup
 * @param {string} findingsText - Findings text
 * @param {Array} templates - Available templates
 * @returns {Array} Findings requiring followup
 */
export function extractFollowupFindings(findingsText, templates = []) {
  const findings = [];
  const lines = findingsText.split('\n').filter(line => line.trim());

  const followupKeywords = [
    'recommend', 'follow-up', 'follow up', 'suggest', 'consider',
    'repeat', 're-evaluate', 'reevaluate', 'monitor', 'tracking',
    'further evaluation', 'additional'
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasFollowup = followupKeywords.some(keyword => lowerLine.includes(keyword));
    
    if (hasFollowup) {
      findings.push({
        original: line,
        requiresFollowup: true,
        urgency: determineUrgency(line)
      });
    }
  }

  return findings;
}

/**
 * Determines urgency level from text
 * @param {string} text - Text to analyze
 * @returns {string} Urgency level
 */
function determineUrgency(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately')) {
    return 'URGENT';
  }
  if (lower.includes('stat') || lower.includes('emergency')) {
    return 'STAT';
  }
  if (lower.includes('3 month') || lower.includes('3-month')) {
    return 'ROUTINE';
  }
  if (lower.includes('6 month') || lower.includes('6-month')) {
    return 'ROUTINE';
  }
  if (lower.includes('1 year') || lower.includes('12 month')) {
    return 'ROUTINE';
  }
  
  return 'ELEVATED';
}

/**
 * Generates followup recommendation based on findings
 * @param {Object} finding - Finding object
 * @param {Object} options - Generation options
 * @returns {Object} Followup recommendation
 */
export function generateFollowupRecommendation(finding, options = {}) {
  const {
    modality = 'CT',
    bodyRegion = 'UNKNOWN',
    clinicalHistory = ''
  } = options;

  const recommendations = [];

  // Analyze finding and generate appropriate recommendations
  if (finding.original.toLowerCase().includes('nodule')) {
    recommendations.push(generateNoduleFollowup(finding, options));
  }
  
  if (finding.original.toLowerCase().includes('mass')) {
    recommendations.push(generateMassFollowup(finding, options));
  }
  
  if (finding.original.toLowerCase().includes('lesion')) {
    recommendations.push(generateLesionFollowup(finding, options));
  }

  if (recommendations.length === 0) {
    recommendations.push(generateDefaultFollowup(finding, options));
  }

  return {
    finding: finding.original,
    recommendations,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generates nodule followup recommendation
 * @param {Object} finding - Finding
 * @param {Object} options - Options
 * @returns {Object} Recommendation
 */
function generateNoduleFollowup(finding, options) {
  const sizeMatch = finding.original.match(/(\d+\.?\d*)\s*mm/i);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
  
  let timeframe = '3 months';
  let modality = 'CT';
  
  if (size < 4) {
    timeframe = '12 months';
    modality = 'LDCT';
  } else if (size < 6) {
    timeframe = '6 months';
  } else if (size < 8) {
    timeframe = '3 months';
  } else {
    timeframe = '1-2 weeks';
    modality = 'PET-CT';
  }

  return {
    modality,
    timeframe,
    reason: `Pulmonary nodule measuring ${size}mm - follow-up to assess for interval change`,
    notes: 'Consider PET-CT if suspicious characteristics'
  };
}

/**
 * Generates mass followup recommendation
 * @param {Object} finding - Finding
 * @param {Object} options - Options
 * @returns {Object} Recommendation
 */
function generateMassFollowup(finding, options) {
  return {
    modality: 'MRI',
    timeframe: '4-6 weeks',
    reason: 'Indeterminate mass - further characterization recommended',
    notes: 'Consider biopsy if concerning features'
  };
}

/**
 * Generates lesion followup recommendation
 * @param {Object} finding - Finding
 * @param {Object} options - Options
 * @returns {Object} Recommendation
 */
function generateLesionFollowup(finding, options) {
  return {
    modality: options.modality || 'CT',
    timeframe: '3-6 months',
    reason: 'Lesion identified - interval evaluation to assess stability',
    notes: 'Compare with prior studies if available'
  };
}

/**
 * Generates default followup recommendation
 * @param {Object} finding - Finding
 * @param {Object} options - Options
 * @returns {Object} Recommendation
 */
function generateDefaultFollowup(finding, options) {
  return {
    modality: options.modality || 'CT',
    timeframe: '3-6 months',
    reason: 'Findings require clinical correlation and follow-up',
    notes: 'Clinical correlation recommended'
  };
}

/**
 * Creates followup recommendations from report
 * @param {Object} report - Report object
 * @returns {Array} Array of followup recommendations
 */
export function createFollowupFromReport(report) {
  const followups = [];
  
  if (!report.findings) return followups;
  
  const findings = extractFollowupFindings(report.findings);
  
  for (const finding of findings) {
    const recommendation = generateFollowupRecommendation(finding, {
      modality: report.modality,
      bodyRegion: report.bodyRegion,
      clinicalHistory: report.clinicalHistory
    });
    
    followups.push({
      id: `fu_${Date.now()}_${followups.length}`,
      reportId: report.id,
      findingId: finding.id || null,
      ...recommendation,
      createdAt: new Date().toISOString()
    });
  }
  
  return followups;
}

/**
 * Gets standard followup intervals for common findings
 * @param {string} findingType - Type of finding
 * @returns {Array} Standard followup intervals
 */
export function getStandardFollowupIntervals(findingType) {
  const intervals = {
    pulmonary_nodule: [
      { size: '<4mm', interval: '12 months', modality: 'LDCT' },
      { size: '4-6mm', interval: '6 months', modality: 'CT' },
      { size: '6-8mm', interval: '3 months', modality: 'CT' },
      { size: '>8mm', interval: '1-2 weeks', modality: 'PET-CT' }
    ],
    liver_lesion: [
      { type: 'cystic', interval: '12 months', modality: 'US' },
      { type: 'solid <1cm', interval: '6 months', modality: 'MRI' },
      { type: 'solid 1-2cm', interval: '3-6 months', modality: 'MRI' },
      { type: 'solid >2cm', interval: '1-3 months', modality: 'MRI' }
    ],
    kidney_lesion: [
      { type: 'cyst', interval: '12 months', modality: 'US' },
      { type: 'solid <1cm', interval: '6 months', modality: 'CT/MRI' },
      { type: 'solid 1-2cm', interval: '3-6 months', modality: 'CT/MRI' },
      { type: 'solid >2cm', interval: '1-3 months', modality: 'CT/MRI' }
    ],
    breast_lesion: [
      { birads: '3', interval: '6 months', modality: 'Mammogram' },
      { birads: '4', interval: '1-2 weeks', modality: 'Biopsy' },
      { birads: '5', interval: '1-2 weeks', modality: 'Biopsy' }
    ],
    thyroid_nodule: [
      { size: '<1cm', interval: '12 months', modality: 'US' },
      { size: '1-1.5cm', interval: '6-12 months', modality: 'US' },
      { size: '>1.5cm', interval: 'Soon', modality: 'FNA' }
    ]
  };

  return intervals[findingType] || [];
}

/**
 * Formats followup recommendation for display
 * @param {Object} followup - Followup recommendation
 * @returns {string} Formatted text
 */
export function formatFollowupText(followup) {
  const parts = [];
  
  if (followup.modality) {
    parts.push(followup.modality);
  }
  
  if (followup.timeframe) {
    parts.push(`in ${followup.timeframe}`);
  }
  
  if (followup.reason) {
    parts.push(`- ${followup.reason}`);
  }
  
  if (followup.notes) {
    parts.push(`(${followup.notes})`);
  }
  
  return parts.join(' ');
}

/**
 * Validates followup recommendation
 * @param {Object} followup - Followup to validate
 * @returns {Object} Validation result
 */
export function validateFollowup(followup) {
  const errors = [];
  
  if (!followup.modality) {
    errors.push('Modality is required');
  }
  
  if (!followup.timeframe) {
    errors.push('Timeframe is required');
  }
  
  if (!followup.reason) {
    errors.push('Reason is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  extractFollowupFindings,
  generateFollowupRecommendation,
  createFollowupFromReport,
  getStandardFollowupIntervals,
  formatFollowupText,
  validateFollowup
};