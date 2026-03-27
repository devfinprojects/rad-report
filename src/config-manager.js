/**
 * Configuration Manager Module - Environment and App Configuration
 * Part of RadReport AI Configuration & Prompts
 */

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  environment: 'development',
  apiVersion: '1.0.0',
  maxTemplateSize: 50000,
  maxSnippetSize: 10000,
  defaultModality: 'CT',
  defaultSystem: 'BODY',
  enableStreaming: true,
  enableDebug: false,
  rateLimitRequests: 100,
  rateLimitWindow: 60, // seconds
  sessionTimeout: 3600, // 1 hour in seconds
  maxReportLength: 50000,
  maxTemplates: 1000,
  maxSnippets: 5000,
  enableMetrics: true,
  enableCaching: true,
  cacheTTL: 300, // 5 minutes
  maxSearchResults: 50,
  defaultPageSize: 20,
  maxPageSize: 100,
  enableFuzzySearch: true,
  fuzzyThreshold: 0.3,
  enableVersioning: true,
  maxVersions: 10,
  enableTemplates: true,
  enableSnippets: true,
  enableAutoSave: true,
  autoSaveInterval: 2000,
  enableComparison: true,
  enableAddendum: true,
  enableFollowup: true,
  defaultUrgency: 'ROUTINE',
  defaultStatus: 'DRAFT'
};

/**
 * Modality configuration
 */
export const MODALITY_CONFIG = {
  CT: {
    name: 'Computed Tomography',
    bodyRegions: ['HEAD', 'NECK', 'CHEST', 'ABDOMEN', 'PELVIS', 'SPINE', 'EXTREMITY'],
    defaultContrast: 'WITH IV CONTRAST',
    techniques: ['axial', 'coronal', 'sagittal', '3D reconstruction']
  },
  MRI: {
    name: 'Magnetic Resonance Imaging',
    bodyRegions: ['HEAD', 'NECK', 'SPINE', 'CHEST', 'ABDOMEN', 'PELVIS', 'EXTREMITY', 'JOINT'],
    defaultContrast: 'WITH AND WITHOUT CONTRAST',
    techniques: ['T1', 'T2', 'FLAIR', 'DWI', 'GRE', 'STIR']
  },
  'X-RAY': {
    name: 'Plain Radiograph',
    bodyRegions: ['CHEST', 'ABDOMEN', 'SPINE', 'EXTREMITY', 'HEAD'],
    defaultContrast: 'WITHOUT CONTRAST',
    techniques: ['AP', 'PA', 'LATERAL', 'OBLIQUE']
  },
  ULTRASOUND: {
    name: 'Ultrasound',
    bodyRegions: ['ABDOMEN', 'PELVIS', 'BREAST', 'NECK', 'EXTREMITY'],
    defaultContrast: 'N/A',
    techniques: ['transabdominal', 'transvaginal', 'doppler', 'grayscale']
  },
  MAMMOGRAPHY: {
    name: 'Mammography',
    bodyRegions: ['BREAST'],
    defaultContrast: 'N/A',
    techniques: ['CC', 'MLO', 'DBT', 'contrast-enhanced']
  },
  'PET-CT': {
    name: 'PET/CT',
    bodyRegions: ['WHOLE BODY', 'CHEST', 'ABDOMEN'],
    defaultContrast: 'WITH IV CONTRAST',
    techniques: ['FDG', 'PSMA', 'DOTATATE']
  },
  DEXA: {
    name: 'DXA Scan',
    bodyRegions: ['BONE', 'SPINE', 'HIP'],
    defaultContrast: 'N/A',
    techniques: ['AP spine', 'femur', 'forearm']
  },
  FLUOROSCOPY: {
    name: 'Fluoroscopy',
    bodyRegions: ['GI', 'GU', 'SPINE'],
    defaultContrast: 'WITH CONTRAST',
    techniques: ['single-contrast', 'double-contrast', 'real-time']
  },
  ANGIOGRAPHY: {
    name: 'Angiography',
    bodyRegions: ['HEART', 'BRAIN', 'EXTREMITY', 'ABDOMEN'],
    defaultContrast: 'WITH IV CONTRAST',
    techniques: ['DSA', 'CTA', 'MRA']
  },
  'NUCLEAR MEDICINE': {
    name: 'Nuclear Medicine',
    bodyRegions: ['WHOLE BODY', 'ORGAN SPECIFIC'],
    defaultContrast: 'RADIOTRACER',
    techniques: ['planar', 'SPECT', 'PET']
  }
};

/**
 * Body region configuration
 */
export const BODY_REGION_CONFIG = {
  HEAD: {
    name: 'Head',
    subRegions: ['BRAIN', 'SKULL', 'FACE', 'SINUSES', 'TEMPORAL BONES', 'ORBITS'],
    associatedSystems: ['NEURO', 'ENT']
  },
  NECK: {
    name: 'Neck',
    subRegions: ['SOFT TISSUE', 'PHARYNX', 'LARYNX', 'THYROID', 'CERVICAL SPINE'],
    associatedSystems: ['ENT', 'ENDOCRINE', 'MSK']
  },
  CHEST: {
    name: 'Chest',
    subRegions: ['LUNGS', 'MEDIASTINUM', 'HEART', 'PLEURA', 'CHEST WALL', 'DIAPHRAGM'],
    associatedSystems: ['PULMONARY', 'CARDIOVASCULAR']
  },
  ABDOMEN: {
    name: 'Abdomen',
    subRegions: ['LIVER', 'SPLEEN', 'PANCREAS', 'KIDNEYS', 'ADRENALS', 'BOWEL', 'PERITONEUM'],
    associatedSystems: ['GI', 'GU', 'HEPATOBILIARY']
  },
  PELVIS: {
    name: 'Pelvis',
    subRegions: ['BLADDER', 'PROSTATE', 'UTERUS', 'OVARIES', 'RECTUM', 'BONES'],
    associatedSystems: ['GU', 'GYNECOLOGIC', 'GI']
  },
  SPINE: {
    name: 'Spine',
    subRegions: ['CERVICAL', 'THORACIC', 'LUMBAR', 'SACRAL', 'COCCYGEAL'],
    associatedSystems: ['NEURO', 'MSK']
  },
  'UPPER EXTREMITY': {
    name: 'Upper Extremity',
    subRegions: ['SHOULDER', 'ARM', 'ELBOW', 'FOREARM', 'WRIST', 'HAND'],
    associatedSystems: ['MSK', 'VASCULAR']
  },
  'LOWER EXTREMITY': {
    name: 'Lower Extremity',
    subRegions: ['HIP', 'THIGH', 'KNEE', 'CALF', 'ANKLE', 'FOOT'],
    associatedSystems: ['MSK', 'VASCULAR']
  },
  'WHOLE BODY': {
    name: 'Whole Body',
    subRegions: ['FULL BODY'],
    associatedSystems: ['MULTI']
  },
  HEART: {
    name: 'Heart',
    subRegions: ['CORONARIES', 'VALVES', 'MYOCARDIUM', 'PERICARDIUM'],
    associatedSystems: ['CARDIOVASCULAR']
  },
  BRAIN: {
    name: 'Brain',
    subRegions: ['CEREBRUM', 'CEREBELLUM', 'BRAINSTEM', 'VENTRICLES', 'VESSELS'],
    associatedSystems: ['NEURO']
  },
  BREAST: {
    name: 'Breast',
    subRegions: ['RIGHT BREAST', 'LEFT BREAST', 'AXILLA', 'LYMPH NODES'],
    associatedSystems: ['BREAST']
  },
  BONE: {
    name: 'Bone',
    subRegions: ['VERTEBRAE', 'PELVIS', 'RIBS', 'LONG BONES'],
    associatedSystems: ['MSK']
  },
  JOINT: {
    name: 'Joint',
    subRegions: ['ARTICULAR CARTILAGE', 'LIGAMENTS', 'MENISCI', 'BURSA'],
    associatedSystems: ['MSK']
  }
};

/**
 * System configuration
 */
export const SYSTEM_CONFIG = {
  BODY: {
    name: 'Body',
    modalities: ['CT', 'MRI', 'X-RAY', 'ULTRASOUND']
  },
  NEURO: {
    name: 'Neuroradiology',
    modalities: ['CT', 'MRI', 'X-RAY', 'ANGIOGRAPHY']
  },
  MSK: {
    name: 'Musculoskeletal',
    modalities: ['X-RAY', 'CT', 'MRI', 'ULTRASOUND', 'DEXA']
  },
  CARDIOVASCULAR: {
    name: 'Cardiovascular',
    modalities: ['CT', 'MRI', 'ANGIOGRAPHY', 'X-RAY']
  },
  PULMONARY: {
    name: 'Pulmonary',
    modalities: ['CT', 'X-RAY', 'MRI', 'PET-CT']
  },
  GI: {
    name: 'Gastrointestinal',
    modalities: ['CT', 'MRI', 'X-RAY', 'ULTRASOUND', 'FLUOROSCOPY']
  },
  GU: {
    name: 'Genitourinary',
    modalities: ['CT', 'MRI', 'ULTRASOUND', 'X-RAY']
  },
  BREAST: {
    name: 'Breast',
    modalities: ['MAMMOGRAPHY', 'ULTRASOUND', 'MRI']
  },
  ENT: {
    name: 'ENT',
    modalities: ['CT', 'MRI', 'X-RAY']
  },
  VASCULAR: {
    name: 'Vascular',
    modalities: ['ANGIOGRAPHY', 'CTA', 'MRA', 'ULTRASOUND DOPPLER']
  }
};

/**
 * Gets configuration from environment
 * @param {Object} env - Cloudflare environment
 * @returns {Object} Application configuration
 */
export function getConfig(env = {}) {
  const config = { ...DEFAULT_CONFIG };
  
  // Override with environment variables
  if (env) {
    if (env.ENVIRONMENT) config.environment = env.ENVIRONMENT;
    if (env.API_VERSION) config.apiVersion = env.API_VERSION;
    if (env.MAX_TEMPLATE_SIZE) config.maxTemplateSize = parseInt(env.MAX_TEMPLATE_SIZE, 10);
    if (env.MAX_SNIPPET_SIZE) config.maxSnippetSize = parseInt(env.MAX_SNIPPET_SIZE, 10);
    if (env.DEFAULT_MODALITY) config.defaultModality = env.DEFAULT_MODALITY;
    if (env.DEFAULT_SYSTEM) config.defaultSystem = env.DEFAULT_SYSTEM;
    if (env.ENABLE_STREAMING) config.enableStreaming = env.ENABLE_STREAMING === 'true';
    if (env.ENABLE_DEBUG) config.enableDebug = env.ENABLE_DEBUG === 'true';
    if (env.RATE_LIMIT_REQUESTS) config.rateLimitRequests = parseInt(env.RATE_LIMIT_REQUESTS, 10);
    if (env.RATE_LIMIT_WINDOW) config.rateLimitWindow = parseInt(env.RATE_LIMIT_WINDOW, 10);
  }
  
  return config;
}

/**
 * Gets KV namespace bindings
 * @param {Object} env - Cloudflare environment
 * @returns {Object} KV bindings
 */
export function getKVBindings(env = {}) {
  return {
    templates: env.TEMPLATES || null,
    snippets: env.SNIPPETS || null,
    reports: env.REPORTS || null,
    sessions: env.SESSIONS || null,
    usage: env.USAGE || null
  };
}

/**
 * Validates configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
export function validateConfig(config) {
  const errors = [];
  
  if (config.maxTemplateSize < 1000) {
    errors.push('maxTemplateSize must be at least 1000');
  }
  
  if (config.maxSnippetSize < 500) {
    errors.push('maxSnippetSize must be at least 500');
  }
  
  if (config.rateLimitRequests < 1) {
    errors.push('rateLimitRequests must be at least 1');
  }
  
  if (config.sessionTimeout < 60) {
    errors.push('sessionTimeout must be at least 60 seconds');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gets feature flags
 * @param {Object} env - Cloudflare environment
 * @returns {Object} Feature flags
 */
export function getFeatureFlags(env = {}) {
  return {
    streaming: env.ENABLE_STREAMING === 'true',
    debug: env.ENABLE_DEBUG === 'true',
    metrics: true,
    caching: true,
    versioning: true,
    templates: true,
    snippets: true,
    autoSave: true,
    comparison: true,
    addendum: true,
    followup: true
  };
}

/**
 * Gets AI model configuration
 * @param {Object} env - Cloudflare environment
 * @returns {Object} AI model config
 */
export function getAIConfig(env = {}) {
  return {
    model: env.AI_MODEL || 'default-model',
    endpoint: env.AI_ENDPOINT || '',
    apiKey: env.AI_API_KEY || '',
    timeout: parseInt(env.AI_TIMEOUT || '30000', 10),
    maxRetries: parseInt(env.AI_MAX_RETRIES || '3', 10),
    temperature: parseFloat(env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(env.AI_MAX_TOKENS || '2000', 10)
  };
}

/**
 * Gets rate limit configuration
 * @param {Object} env - Cloudflare environment
 * @returns {Object} Rate limit config
 */
export function getRateLimitConfig(env = {}) {
  return {
    requests: parseInt(env.RATE_LIMIT_REQUESTS || '100', 10),
    window: parseInt(env.RATE_LIMIT_WINDOW || '60', 10),
    perUser: env.RATE_LIMIT_PER_USER === 'true',
    byIP: env.RATE_LIMIT_BY_IP === 'true'
  };
}

/**
 * Merges default config with environment config
 * @param {Object} defaults - Default configuration
 * @param {Object} envConfig - Environment configuration
 * @returns {Object} Merged configuration
 */
export function mergeConfig(defaults, envConfig) {
  return { ...defaults, ...envConfig };
}

/**
 * Gets all available modalities
 * @returns {Array} Array of modality codes
 */
export function getAvailableModalities() {
  return Object.keys(MODALITY_CONFIG);
}

/**
 * Gets all body regions for a modality
 * @param {string} modality - Modality code
 * @returns {Array} Array of body regions
 */
export function getBodyRegionsForModality(modality) {
  const config = MODALITY_CONFIG[modality];
  return config ? config.bodyRegions : [];
}

/**
 * Gets all systems
 * @returns {Array} Array of system codes
 */
export function getAvailableSystems() {
  return Object.keys(SYSTEM_CONFIG);
}

/**
 * Gets configuration for a specific modality
 * @param {string} modality - Modality code
 * @returns {Object} Modality configuration
 */
export function getModalitySettings(modality) {
  return MODALITY_CONFIG[modality] || null;
}

export default {
  DEFAULT_CONFIG,
  MODALITY_CONFIG,
  BODY_REGION_CONFIG,
  SYSTEM_CONFIG,
  getConfig,
  getKVBindings,
  validateConfig,
  getFeatureFlags,
  getAIConfig,
  getRateLimitConfig,
  mergeConfig,
  getAvailableModalities,
  getBodyRegionsForModality,
  getAvailableSystems,
  getModalitySettings
};