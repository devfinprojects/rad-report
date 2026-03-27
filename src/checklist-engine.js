/**
 * Checklist Engine Module - Anatomy Checklist Management
 * Part of RadReport AI Engine Components
 */

/**
 * Gets checklist for a template
 * @param {Object} template - Template object
 * @returns {Array} Checklist items
 */
export function getTemplateChecklist(template) {
  if (!template || !template.anatomyChecklist) {
    return [];
  }

  return template.anatomyChecklist.map(item => ({
    ...item,
    checked: false,
    findings: ''
  }));
}

/**
 * Updates checklist item
 * @param {Array} checklist - Current checklist
 * @param {string} itemId - Item ID to update
 * @param {Object} updates - Updates to apply
 * @returns {Array} Updated checklist
 */
export function updateChecklistItem(checklist, itemId, updates) {
  return checklist.map(item => {
    if (item.id === itemId) {
      return { ...item, ...updates };
    }
    return item;
  });
}

/**
 * Toggles checklist item checked status
 * @param {Array} checklist - Current checklist
 * @param {string} itemId - Item ID to toggle
 * @returns {Array} Updated checklist
 */
export function toggleChecklistItem(checklist, itemId) {
  return checklist.map(item => {
    if (item.id === itemId) {
      return { ...item, checked: !item.checked };
    }
    return item;
  });
}

/**
 * Gets checklist completion statistics
 * @param {Array} checklist - Checklist to analyze
 * @returns {Object} Completion statistics
 */
export function getChecklistStats(checklist) {
  if (!checklist || checklist.length === 0) {
    return {
      total: 0,
      checked: 0,
      unchecked: 0,
      percentage: 0
    };
  }

  const total = checklist.length;
  const checked = checklist.filter(item => item.checked).length;
  const unchecked = total - checked;
  const percentage = Math.round((checked / total) * 100);

  return {
    total,
    checked,
    unchecked,
    percentage
  };
}

/**
 * Generates findings from completed checklist
 * @param {Array} checklist - Completed checklist
 * @returns {string} Findings text
 */
export function generateChecklistFindings(checklist) {
  const findings = [];

  // Normal checked items
  const normalItems = checklist.filter(item => item.checked && item.isNormal !== false);
  if (normalItems.length > 0) {
    const names = normalItems.map(item => item.name).join(', ');
    findings.push(`The following structures appear normal: ${names}.`);
  }

  // Items with findings
  const abnormalItems = checklist.filter(item => item.findings && item.findings.trim() !== '');
  for (const item of abnormalItems) {
    findings.push(`${item.name}: ${item.findings}`);
  }

  // Unchecked items that might be abnormal
  const uncheckedItems = checklist.filter(item => !item.checked);
  if (uncheckedItems.length > 0) {
    findings.push(`The following structures were not visualized/assessed: ${uncheckedItems.map(i => i.name).join(', ')}.`);
  }

  return findings.length > 0 ? findings.join(' ') : 'Anatomy checklist completed.';
}

/**
 * Validates checklist completion
 * @param {Array} checklist - Checklist to validate
 * @param {number} requiredPercentage - Required completion percentage
 * @returns {Object} Validation result
 */
export function validateChecklist(checklist, requiredPercentage = 80) {
  const stats = getChecklistStats(checklist);

  const isComplete = stats.percentage >= requiredPercentage;

  return {
    isComplete,
    stats,
    message: isComplete 
      ? 'Checklist is complete' 
      : `Checklist is ${stats.percentage}% complete. ${requiredPercentage}% required.`
  };
}

/**
 * Creates default anatomy checklist for a body region
 * @param {string} bodyRegion - Body region code
 * @returns {Array} Default checklist
 */
export function createDefaultChecklist(bodyRegion) {
  const checklists = {
    HEAD: [
      { id: 'head_1', name: 'Frontal Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'head_2', name: 'Temporal Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'head_3', name: 'Parietal Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'head_4', name: 'Occipital Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'head_5', name: 'Cerebellum', isNormal: true, checked: false, findings: '' },
      { id: 'head_6', name: 'Brainstem', isNormal: true, checked: false, findings: '' },
      { id: 'head_7', name: 'Lateral Ventricles', isNormal: true, checked: false, findings: '' },
      { id: 'head_8', name: 'Third Ventricle', isNormal: true, checked: false, findings: '' },
      { id: 'head_9', name: 'Fourth Ventricle', isNormal: true, checked: false, findings: '' },
      { id: 'head_10', name: 'Basal Cisterns', isNormal: true, checked: false, findings: '' }
    ],
    CHEST: [
      { id: 'chest_1', name: 'Right Upper Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'chest_2', name: 'Right Middle Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'chest_3', name: 'Right Lower Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'chest_4', name: 'Left Upper Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'chest_5', name: 'Left Lower Lobe', isNormal: true, checked: false, findings: '' },
      { id: 'chest_6', name: 'Trachea', isNormal: true, checked: false, findings: '' },
      { id: 'chest_7', name: 'Main Bronchi', isNormal: true, checked: false, findings: '' },
      { id: 'chest_8', name: 'Heart', isNormal: true, checked: false, findings: '' },
      { id: 'chest_9', name: 'Mediastinum', isNormal: true, checked: false, findings: '' },
      { id: 'chest_10', name: 'Pleura', isNormal: true, checked: false, findings: '' }
    ],
    ABDOMEN: [
      { id: 'abdo_1', name: 'Liver', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_2', name: 'Gallbladder', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_3', name: 'Pancreas', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_4', name: 'Spleen', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_5', name: 'Right Kidney', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_6', name: 'Left Kidney', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_7', name: 'Adrenal Glands', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_8', name: 'Small Bowel', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_9', name: 'Large Bowel', isNormal: true, checked: false, findings: '' },
      { id: 'abdo_10', name: 'Aorta', isNormal: true, checked: false, findings: '' }
    ],
    SPINE: [
      { id: 'spine_1', name: 'Vertebral Bodies', isNormal: true, checked: false, findings: '' },
      { id: 'spine_2', name: 'Intervertebral Discs', isNormal: true, checked: false, findings: '' },
      { id: 'spine_3', name: 'Spinal Cord', isNormal: true, checked: false, findings: '' },
      { id: 'spine_4', name: 'Nerve Roots', isNormal: true, checked: false, findings: '' },
      { id: 'spine_5', name: 'Neural Foramina', isNormal: true, checked: false, findings: '' },
      { id: 'spine_6', name: 'Paraspinal Soft Tissues', isNormal: true, checked: false, findings: '' }
    ],
    PELVIS: [
      { id: 'pelvis_1', name: 'Bladder', isNormal: true, checked: false, findings: '' },
      { id: 'pelvis_2', name: 'Uterus/Ovaries', isNormal: true, checked: false, findings: '' },
      { id: 'pelvis_3', name: 'Prostate', isNormal: true, checked: false, findings: '' },
      { id: 'pelvis_4', name: 'Rectum', isNormal: true, checked: false, findings: '' },
      { id: 'pelvis_5', name: 'Pelvic Bones', isNormal: true, checked: false, findings: '' }
    ]
  };

  return checklists[bodyRegion] || [];
}

/**
 * Resets checklist to unchecked state
 * @param {Array} checklist - Checklist to reset
 * @returns {Array} Reset checklist
 */
export function resetChecklist(checklist) {
  return checklist.map(item => ({
    ...item,
    checked: false,
    findings: ''
  }));
}

/**
 * Marks all items as checked
 * @param {Array} checklist - Checklist to mark
 * @returns {Array} All checked checklist
 */
export function checkAllItems(checklist) {
  return checklist.map(item => ({
    ...item,
    checked: true
  }));
}

/**
 * Unmarks all items
 * @param {Array} checklist - Checklist to unmark
 * @returns {Array} All unchecked checklist
 */
export function uncheckAllItems(checklist) {
  return checklist.map(item => ({
    ...item,
    checked: false
  }));
}

export default {
  getTemplateChecklist,
  updateChecklistItem,
  toggleChecklistItem,
  getChecklistStats,
  generateChecklistFindings,
  validateChecklist,
  createDefaultChecklist,
  resetChecklist,
  checkAllItems,
  uncheckAllItems
};