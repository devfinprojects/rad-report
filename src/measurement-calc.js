/**
 * Measurement Calculator Module - Radiology Measurements and Calculations
 * Part of RadReport AI Engine Components
 */

/**
 * Calculates volume from dimensions (ellipsoid)
 * @param {number} dimension1 - First dimension in mm
 * @param {number} dimension2 - Second dimension in mm
 * @param {number} dimension3 - Third dimension in mm
 * @returns {number} Volume in cm³
 */
export function calculateVolume(dimension1, dimension2, dimension3) {
  if (dimension1 <= 0 || dimension2 <= 0 || dimension3 <= 0) return 0;
  // Volume of ellipsoid = (4/3) * π * a * b * c
  const volumeMm3 = (4 / 3) * Math.PI * (dimension1 / 2) * (dimension2 / 2) * (dimension3 / 2);
  return Math.round(volumeMm3 / 1000 * 100) / 100; // Convert to cm³
}

/**
 * Calculates volume from single dimension (assuming sphere)
 * @param {number} diameter - Diameter in mm
 * @returns {number} Volume in cm³
 */
export function calculateSphereVolume(diameter) {
  if (diameter <= 0) return 0;
  const radius = diameter / 2;
  const volumeMm3 = (4 / 3) * Math.PI * Math.pow(radius, 3);
  return Math.round(volumeMm3 / 1000 * 100) / 100;
}

/**
 * Calculates estimated volume from area (2D to 3D estimate)
 * @param {number} areaMm2 - Area in mm²
 * @param {number} thicknessMm - Assumed thickness in mm
 * @returns {number} Estimated volume in cm³
 */
export function calculateVolumeFromArea(areaMm2, thicknessMm = 10) {
  if (areaMm2 <= 0 || thicknessMm <= 0) return 0;
  const volumeMm3 = areaMm2 * thicknessMm;
  return Math.round(volumeMm3 / 1000 * 100) / 100;
}

/**
 * Calculates SUV (Standardized Uptake Value)
 * @param {number} injectedDoseMBq - Injected dose in MBq
 * @param {number} patientWeightKg - Patient weight in kg
 * @param {number} activityAtScanMBq - Activity at scan time in MBq
 * @returns {number} SUV
 */
export function calculateSUV(injectedDoseMBq, patientWeightKg, activityAtScanMBq) {
  if (injectedDoseMBq <= 0 || patientWeightKg <= 0 || activityAtScanMBq <= 0) return 0;
  return Math.round((activityAtScanMBq / injectedDoseMBq) * patientWeightKg * 100) / 100;
}

/**
 * Calculates BMI (Body Mass Index)
 * @param {number} weightKg - Weight in kg
 * @param {number} heightCm - Height in cm
 * @returns {number} BMI
 */
export function calculateBMI(weightKg, heightCm) {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Gets BMI category
 * @param {number} bmi - BMI value
 * @returns {string} BMI category
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Calculates eGFR (estimated Glomerular Filtration Rate)
 * @param {number} serumCreatinine - Serum creatinine in mg/dL
 * @param {number} age - Patient age
 * @param {string} gender - 'male' or 'female'
 * @param {number} weightKg - Patient weight in kg (optional)
 * @returns {number} eGFR in mL/min/1.73m²
 */
export function calculateeGFR(serumCreatinine, age, gender, weightKg = 70) {
  if (serumCreatinine <= 0 || age <= 0) return 0;
  
  let factor = gender === 'female' ? 0.742 : 1;
  
  // MDRD formula
  const egfr = 175 * Math.pow(serumCreatinine, -1.154) * Math.pow(age, -0.203) * factor;
  
  // Adjust for body surface area if weight provided
  const bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(170, 0.725);
  const adjusted = egfr * (bsa / 1.73);
  
  return Math.round(adjusted * 10) / 10;
}

/**
 * Calculates calcium score (coronary artery calcium)
 * @param {number} totalCalcium - Total calcium score (Agatston)
 * @returns {Object} Risk category and interpretation
 */
export function interpretCalciumScore(totalCalcium) {
  if (totalCalcium === 0) {
    return { category: 'Minimal', risk: 'Very Low', interpretation: 'No identifiable plaque. Low risk of future cardiac events.' };
  }
  if (totalCalcium <= 10) {
    return { category: 'Mild', risk: 'Low', interpretation: 'Minimal plaque. Low risk, consider preventive measures.' };
  }
  if (totalCalcium <= 100) {
    return { category: 'Moderate', risk: 'Moderate', interpretation: 'Moderate plaque burden. Recommend lifestyle modification.' };
  }
  if (totalCalcium <= 400) {
    return { category: 'Severe', risk: 'High', interpretation: 'Significant plaque. Aggressive risk factor modification needed.' };
  }
  return { category: 'Extensive', risk: 'Very High', interpretation: 'Extensive calcification. High risk, Cardiology referral recommended.' };
}

/**
 * Calculates liver volume from CT measurements
 * @param {number} craniocaudalCm - Craniocaudal diameter in cm
 * @param {number} transverseCm - Transverse diameter in cm
 * @param {number} apCm - Anteroposterior diameter in cm
 * @returns {number} Estimated liver volume in cm³
 */
export function calculateLiverVolume(craniocaudalCm, transverseCm, apCm) {
  if (craniocaudalCm <= 0 || transverseCm <= 0 || apCm <= 0) return 0;
  // Ellipsoid formula
  const volume = 0.52 * craniocaudalCm * transverseCm * apCm;
  return Math.round(volume * 10) / 10;
}

/**
 * Calculates splenic volume
 * @param {number} lengthCm - Length in cm
 * @param {number} widthCm - Width in cm
 * @param {number} thicknessCm - Thickness in cm
 * @returns {number} Estimated volume in cm³
 */
export function calculateSplenicVolume(lengthCm, widthCm, thicknessCm) {
  if (lengthCm <= 0 || widthCm <= 0 || thicknessCm <= 0) return 0;
  const volume = 0.52 * lengthCm * widthCm * thicknessCm;
  return Math.round(volume * 10) / 10;
}

/**
 * Calculates renal volume
 * @param {number} lengthCm - Length in cm
 * @param {number} widthCm - Width in cm
 * @param {number} thicknessCm - Thickness in cm
 * @returns {number} Estimated volume in cm³
 */
export function calculateRenalVolume(lengthCm, widthCm, thicknessCm) {
  if (lengthCm <= 0 || widthCm <= 0 || thicknessCm <= 0) return 0;
  const volume = 0.52 * lengthCm * widthCm * thicknessCm;
  return Math.round(volume * 10) / 10;
}

/**
 * Converts Hounsfield Units to density
 * @param {number} hu - Hounsfield units
 * @returns {string} Density interpretation
 */
export function interpretDensity(hu) {
  if (hu < -100) return 'Fat density';
  if (hu < 0) return 'Low density - likely fluid or fat';
  if (hu < 30) return 'Soft tissue density';
  if (hu < 60) return 'Soft tissue - muscle density';
  if (hu < 130) return 'Soft tissue - enhancing';
  if (hu < 400) return 'Calcified';
  return 'Bone density';
}

/**
 * Calculates pulmonary nodule volume doubling time
 * @param {number} volume1 - Initial volume in mm³
 * @param {number} volume2 - Follow-up volume in mm³
 * @param {number} daysBetween - Days between scans
 * @returns {number} Doubling time in days
 */
export function calculateDoublingTime(volume1, volume2, daysBetween) {
  if (volume1 <= 0 || volume2 <= 0 || daysBetween <= 0) return 0;
  if (volume2 <= volume1) return Infinity;
  
  const doublingTime = (daysBetween * Math.log(2)) / Math.log(volume2 / volume1);
  return Math.round(doublingTime);
}

/**
 * Interprets doubling time for malignancy risk
 * @param {number} days - Doubling time in days
 * @returns {Object} Risk assessment
 */
export function interpretDoublingTime(days) {
  if (days === Infinity) return { risk: 'N/A', interpretation: 'No growth detected' };
  if (days < 30) return { risk: 'High', interpretation: 'Rapid growth - concerning for aggressive lesion' };
  if (days < 90) return { risk: 'Moderate', interpretation: 'Intermediate growth - requires close follow-up' };
  if (days < 180) return { risk: 'Low', interpretation: 'Slow growth - likely benign' };
  return { risk: 'Very Low', interpretation: 'Very slow growth - typically benign' };
}

/**
 * Calculates ejection fraction from echocardiography
 * @param {number} edv - End-diastolic volume in mL
 * @param {number} esv - End-systolic volume in mL
 * @returns {number} Ejection fraction percentage
 */
export function calculateEjectionFraction(edv, esv) {
  if (edv <= 0 || esv >= edv) return 0;
  const ef = ((edv - esv) / edv) * 100;
  return Math.round(ef * 10) / 10;
}

/**
 * Interprets ejection fraction
 * @param {number} ef - Ejection fraction percentage
 * @returns {string} Interpretation
 */
export function interpretEjectionFraction(ef) {
  if (ef >= 55) return 'Normal';
  if (ef >= 40) return 'Mildly reduced';
  if (ef >= 30) return 'Moderately reduced';
  return 'Severely reduced';
}

/**
 * Calculates stroke volume
 * @param {number} edv - End-diastolic volume in mL
 * @param {number} esv - End-systolic volume in mL
 * @returns {number} Stroke volume in mL
 */
export function calculateStrokeVolume(edv, esv) {
  if (edv <= 0 || esv >= edv) return 0;
  return edv - esv;
}

/**
 * Calculates cardiac output
 * @param {number} strokeVolume - Stroke volume in mL
 * @param {number} heartRate - Heart rate in bpm
 * @returns {number} Cardiac output in L/min
 */
export function calculateCardiacOutput(strokeVolume, heartRate) {
  if (strokeVolume <= 0 || heartRate <= 0) return 0;
  const co = (strokeVolume * heartRate) / 1000;
  return Math.round(co * 10) / 10;
}

/**
 * Formats measurement for display
 * @param {number} value - Measurement value
 * @param {string} unit - Unit of measurement
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
export function formatMeasurement(value, unit, decimals = 1) {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Converts cm to inches
 * @param {number} cm - Centimeters
 * @returns {number} Inches
 */
export function cmToInches(cm) {
  return Math.round(cm / 2.54 * 10) / 10;
}

/**
 * Converts inches to cm
 * @param {number} inches - Inches
 * @returns {number} Centimeters
 */
export function inchesToCm(inches) {
  return Math.round(inches * 2.54 * 10) / 10;
}

/**
 * Converts kg to lbs
 * @param {number} kg - Kilograms
 * @returns {number} Pounds
 */
export function kgToLbs(kg) {
  return Math.round(kg * 2.205 * 10) / 10;
}

/**
 * Converts lbs to kg
 * @param {number} lbs - Pounds
 * @returns {number} Kilograms
 */
export function lbsToKg(lbs) {
  return Math.round(lbs / 2.205 * 10) / 10;
}

export default {
  calculateVolume,
  calculateSphereVolume,
  calculateVolumeFromArea,
  calculateSUV,
  calculateBMI,
  getBMICategory,
  calculateeGFR,
  interpretCalciumScore,
  calculateLiverVolume,
  calculateSplenicVolume,
  calculateRenalVolume,
  interpretDensity,
  calculateDoublingTime,
  interpretDoublingTime,
  calculateEjectionFraction,
  interpretEjectionFraction,
  calculateStrokeVolume,
  calculateCardiacOutput,
  formatMeasurement,
  cmToInches,
  inchesToCm,
  kgToLbs,
  lbsToKg
};