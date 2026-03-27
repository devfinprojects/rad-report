/**
 * App Module - Main Application Logic
 * Part of RadReport AI Frontend
 */

// Import dependencies
import { getStyles, getThemeColors, getComponentStyles } from './styles.js';
import { generateHTML, generateHeader, generateLayout, generateCard, generateModal, generateAlert, generateTabs, generateTable, generateButton, generateField, generateSpinner, generateBreadcrumb, generateBadge, generateProgress } from './html.js';
import { weightedFuzzyMatch, multiFieldFuzzySearch, createAutocomplete, highlightMatches, fuzzySort } from './fuzzy-functions.js';
import { templateData } from './template-data.js';
import { snippetData } from './snippet-data.js';

/**
 * Application state
 */
const appState = {
  currentView: 'create',
  currentReport: null,
  templates: [],
  snippets: [],
  searchQuery: '',
  selectedTemplate: null,
  selectedCategory: 'ANATOMY',
  isLoading: false,
  error: null
};

/**
 * Initialize application
 */
export function initApp() {
  appState.templates = templateData;
  appState.snippets = snippetData;
  
  // Render the app
  renderApp();
  
  // Set up event listeners
  setupEventListeners();
  
  return appState;
}

/**
 * Render complete application
 */
function renderApp() {
  const styles = getStyles();
  const body = generateAppBody();
  
  const html = generateHTML({
    title: 'RadReport AI - Radiology Report Generator',
    styles,
    body
  });
  
  // Inject into DOM
  document.documentElement.innerHTML = html;
  
  // Initialize view-specific components
  initCurrentView();
}

/**
 * Generates app body content
 * @returns {string} Body HTML
 */
function generateAppBody() {
  const header = generateHeader({
    logo: 'RadReport AI',
    nav: [
      { label: 'Create Report', view: 'create', active: true },
      { label: 'Templates', view: 'templates', active: false },
      { label: 'Snippets', view: 'snippets', active: false },
      { label: 'Dashboard', view: 'dashboard', active: false }
    ]
  });

  const content = generateCreateView();
  
  return `
    ${header}
    <div class="container">
      ${content}
    </div>
  `;
}

/**
 * Generates create report view
 * @returns {string} View HTML
 */
function generateCreateView() {
  return `
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Report Editor</h2>
        </div>
        
        <div class="form-group">
          <label class="form-label">Modality</label>
          <select class="form-select" id="modality">
            <option value="">Select Modality</option>
            <option value="CT">CT - Computed Tomography</option>
            <option value="MRI">MRI - Magnetic Resonance Imaging</option>
            <option value="X-RAY">X-Ray</option>
            <option value="ULTRASOUND">Ultrasound</option>
            <option value="MAMMOGRAPHY">Mammography</option>
            <option value="PET-CT">PET/CT</option>
            <option value="CTA">CTA - CT Angiography</option>
            <option value="MRA">MRA - MR Angiography</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Body Region</label>
          <select class="form-select" id="bodyRegion">
            <option value="">Select Body Region</option>
            <option value="HEAD">Head</option>
            <option value="CHEST">Chest</option>
            <option value="ABDOMEN">Abdomen</option>
            <option value="PELVIS">Pelvis</option>
            <option value="SPINE">Spine</option>
            <option value="BRAIN">Brain</option>
            <option value="HEART">Heart</option>
            <option value="BREAST">Breast</option>
            <option value="BONE">Bone</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Search Templates</label>
          <div class="search-box" style="position: relative; margin-bottom: 12px;">
            <input type="text" class="form-input" id="templateSearch" placeholder="Type to search templates..." style="padding-left: 36px;">
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
          </div>
          <div id="templateResults" class="template-list" style="max-height: 200px; overflow-y: auto;"></div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Quick Insert Snippets</label>
          <div class="tabs" style="margin-bottom: 12px;">
            <button class="tab active" data-category="ANATOMY">Anatomy</button>
            <button class="tab" data-category="FINDING">Findings</button>
            <button class="tab" data-category="TECHNIQUE">Technique</button>
            <button class="tab" data-category="MODIFIER">Modifiers</button>
            <button class="tab" data-category="PATHOLOGY">Pathology</button>
          </div>
          <div id="snippetResults" class="snippet-grid" style="max-height: 180px; overflow-y: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;"></div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Report Preview</h2>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="app.clearReport()">Clear</button>
            <button class="btn btn-primary btn-sm" onclick="app.saveReport()">Save Report</button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Clinical History</label>
          <textarea class="form-textarea" id="clinicalHistory" rows="3" placeholder="Enter clinical history and indication..."></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Technique</label>
          <textarea class="form-textarea" id="technique" rows="4" placeholder="Describe imaging technique..."></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Findings</label>
          <textarea class="form-textarea" id="findings" rows="10" placeholder="Enter findings..."></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Impression</label>
          <textarea class="form-textarea" id="impression" rows="5" placeholder="Enter impression..."></textarea>
        </div>
      </div>
    </div>
    
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <h3 class="card-title">Template Preview</h3>
      </div>
      <div id="templatePreview" class="report-preview" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 13px;">
        Select a template to preview its structure...
      </div>
    </div>
  `;
}

/**
 * Initialize current view
 */
function initCurrentView() {
  loadTemplates();
  loadSnippets(appState.selectedCategory);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });

  // Template search
  const templateSearch = document.getElementById('templateSearch');
  if (templateSearch) {
    templateSearch.addEventListener('input', debounce(handleTemplateSearch, 300));
  }

  // Snippet category tabs
  document.querySelectorAll('.tab[data-category]').forEach(tab => {
    tab.addEventListener('click', handleCategoryChange);
  });
}

/**
 * Handle navigation click
 */
function handleNavigation(e) {
  e.preventDefault();
  const view = e.target.closest('a').dataset.view;
  
  document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
  e.target.closest('a').classList.add('active');
  
  appState.currentView = view;
  
  if (view === 'create') {
    renderApp();
  } else if (view === 'templates') {
    renderTemplatesView();
  } else if (view === 'snippets') {
    renderSnippetsView();
  } else if (view === 'dashboard') {
    renderDashboardView();
  }
}

/**
 * Handle template search
 */
async function handleTemplateSearch(e) {
  const query = e.target.value;
  
  if (query.length < 2) {
    document.getElementById('templateResults').innerHTML = '';
    return;
  }

  const results = multiFieldFuzzySearch(appState.templates, query, ['name', 'modality', 'bodyRegion', 'system']);
  
  const container = document.getElementById('templateResults');
  container.innerHTML = results.slice(0, 10).map(r => `
    <div class="template-item" onclick="app.selectTemplate('${r.item.id}')">
      <strong>${highlightMatches(r.item.name, query)}</strong>
      <div style="font-size: 12px; color: var(--text-muted);">
        ${r.item.modality} | ${r.item.bodyRegion} | ${r.item.system}
      </div>
    </div>
  `).join('');
}

/**
 * Handle category change
 */
function handleCategoryChange(e) {
  const category = e.target.dataset.category;
  
  document.querySelectorAll('.tab[data-category]').forEach(tab => tab.classList.remove('active'));
  e.target.classList.add('active');
  
  appState.selectedCategory = category;
  loadSnippets(category);
}

/**
 * Load templates
 */
function loadTemplates() {
  const container = document.getElementById('templateResults');
  if (!container) return;
  
  const recent = appState.templates.slice(0, 5);
  container.innerHTML = recent.map(t => `
    <div class="template-item" onclick="app.selectTemplate('${t.id}')">
      <strong>${t.name}</strong>
      <div style="font-size: 12px; color: var(--text-muted);">${t.modality} | ${t.bodyRegion}</div>
    </div>
  `).join('');
}

/**
 * Load snippets by category
 */
function loadSnippets(category) {
  const filtered = appState.snippets.filter(s => s.category === category);
  const container = document.getElementById('snippetResults');
  
  if (!container) return;
  
  container.innerHTML = filtered.slice(0, 20).map(s => `
    <div class="snippet-item" onclick="app.insertSnippet('${s.trigger}')" title="${s.expansion}">
      <strong>${s.trigger}</strong>
      <div style="font-size: 11px; color: var(--text-muted);">${s.name}</div>
    </div>
  `).join('');
}

/**
 * Select template
 */
export function selectTemplate(templateId) {
  const template = appState.templates.find(t => t.id === templateId);
  if (!template) return;

  appState.selectedTemplate = template;
  
  // Update form fields
  document.getElementById('modality').value = template.modality;
  document.getElementById('bodyRegion').value = template.bodyRegion;
  document.getElementById('findings').value = template.templateText;
  
  // Show template preview
  const preview = document.getElementById('templatePreview');
  if (preview) {
    preview.textContent = template.templateText;
  }
}

/**
 * Insert snippet into findings
 */
export function insertSnippet(trigger) {
  const findings = document.getElementById('findings');
  const snippet = appState.snippets.find(s => s.trigger === trigger);
  
  if (findings && snippet) {
    findings.value += (findings.value ? '\n' : '') + snippet.expansion;
    findings.focus();
  }
}

/**
 * Clear report
 */
export function clearReport() {
  document.getElementById('clinicalHistory').value = '';
  document.getElementById('technique').value = '';
  document.getElementById('findings').value = '';
  document.getElementById('impression').value = '';
  document.getElementById('modality').value = '';
  document.getElementById('bodyRegion').value = '';
  
  appState.selectedTemplate = null;
  document.getElementById('templatePreview').textContent = 'Select a template to preview its structure...';
}

/**
 * Save report
 */
export async function saveReport() {
  const report = {
    modality: document.getElementById('modality').value,
    bodyRegion: document.getElementById('bodyRegion').value,
    clinicalHistory: document.getElementById('clinicalHistory').value,
    technique: document.getElementById('technique').value,
    findings: document.getElementById('findings').value,
    impression: document.getElementById('impression').value
  };

  if (!report.modality || !report.bodyRegion) {
    alert('Please select modality and body region');
    return;
  }

  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Report saved successfully!');
    } else {
      alert('Error saving report: ' + (data.error?.message || 'Unknown error'));
    }
  } catch (error) {
    alert('Error saving report: ' + error.message);
  }
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Render templates view
 */
function renderTemplatesView() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <h2 class="card-title">Templates Library</h2>
      </div>
      <div class="search-box" style="margin-bottom: 16px;">
        <input type="text" class="form-input" id="templateSearchPage" placeholder="Search templates..." style="padding-left: 36px;">
      </div>
      <div id="templatesContainer" class="template-list"></div>
    </div>
  `;
  
  const templatesContainer = document.getElementById('templatesContainer');
  templatesContainer.innerHTML = appState.templates.map(t => `
    <div class="template-item" onclick="app.selectTemplate('${t.id}')">
      <strong>${t.name}</strong>
      <div style="font-size: 12px; color: var(--text-muted);">${t.modality} | ${t.bodyRegion} | ${t.system}</div>
    </div>
  `).join('');
  
  document.getElementById('templateSearchPage').addEventListener('input', debounce((e) => {
    const query = e.target.value;
    const results = query.length >= 2 
      ? multiFieldFuzzySearch(appState.templates, query, ['name', 'modality', 'bodyRegion']).map(r => r.item)
      : appState.templates;
    
    templatesContainer.innerHTML = results.slice(0, 50).map(t => `
      <div class="template-item" onclick="app.selectTemplate('${t.id}')">
        <strong>${highlightMatches(t.name, query)}</strong>
        <div style="font-size: 12px; color: var(--text-muted);">${t.modality} | ${t.bodyRegion} | ${t.system}</div>
      </div>
    `).join('');
  }, 300));
}

/**
 * Render snippets view
 */
function renderSnippetsView() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <h2 class="card-title">Snippets Library</h2>
      </div>
      <div class="search-box" style="margin-bottom: 16px;">
        <input type="text" class="form-input" id="snippetSearchPage" placeholder="Search snippets..." style="padding-left: 36px;">
      </div>
      <div class="tabs" style="margin-bottom: 16px;">
        ${['ANATOMY', 'FINDING', 'TECHNIQUE', 'MODIFIER', 'PATHOLOGY', 'FOLLOWUP'].map(cat => `
          <button class="tab" data-category="${cat}" onclick="app.switchSnippetCategory('${cat}')">${cat}</button>
        `).join('')}
      </div>
      <div id="snippetsContainer" class="snippet-grid" style="grid-template-columns: repeat(3, 1fr);"></div>
    </div>
  `;
  
  renderSnippetsList('ANATOMY');
  
  document.getElementById('snippetSearchPage').addEventListener('input', debounce((e) => {
    const query = e.target.value;
    const results = query.length >= 2
      ? multiFieldFuzzySearch(appState.snippets, query, ['name', 'trigger', 'keywords']).map(r => r.item)
      : appState.snippets;
    
    const container = document.getElementById('snippetsContainer');
    container.innerHTML = results.slice(0, 50).map(s => `
      <div class="snippet-item">
        <strong>${s.trigger}</strong>
        <div style="font-size: 12px; color: var(--text-muted);">${s.name}</div>
      </div>
    `).join('');
  }, 300));
}

/**
 * Render snippets list
 */
function renderSnippetsList(category) {
  const filtered = appState.snippets.filter(s => s.category === category);
  const container = document.getElementById('snippetsContainer');
  
  document.querySelectorAll('.tab[data-category]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
  
  container.innerHTML = filtered.slice(0, 50).map(s => `
    <div class="snippet-item">
      <strong>${s.trigger}</strong>
      <div style="font-size: 12px; color: var(--text-muted);">${s.name}</div>
    </div>
  `).join('');
}

/**
 * Switch snippet category
 */
export function switchSnippetCategory(category) {
  renderSnippetsList(category);
}

/**
 * Render dashboard view
 */
async function renderDashboardView() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <h2 class="card-title">Dashboard</h2>
      </div>
      <div id="dashboardContent">
        ${generateSpinner({ label: 'Loading statistics...' })}
      </div>
    </div>
  `;

  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    const stats = data.data || {};
    
    document.getElementById('dashboardContent').innerHTML = `
      <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-value">${stats.totalReports || 0}</div>
          <div class="stat-label">Total Reports</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Object.keys(stats.reportsByModality || {}).length}</div>
          <div class="stat-label">Modalities Used</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.averageReportLength || 0}</div>
          <div class="stat-label">Avg. Report Length</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Object.keys(stats.reportsByStatus || {}).length}</div>
          <div class="stat-label">Report Statuses</div>
        </div>
      </div>
      
      <h3 class="section-title">Reports by Modality</h3>
      <pre style="background: var(--bg); padding: 16px; border-radius: 8px; font-size: 13px;">${JSON.stringify(stats.reportsByModality || {}, null, 2)}</pre>
      
      <h3 class="section-title" style="margin-top: 24px;">Reports by Status</h3>
      <pre style="background: var(--bg); padding: 16px; border-radius: 8px; font-size: 13px;">${JSON.stringify(stats.reportsByStatus || {}, null, 2)}</pre>
    `;
  } catch (error) {
    document.getElementById('dashboardContent').innerHTML = generateAlert({
      type: 'danger',
      title: 'Error',
      message: 'Failed to load dashboard data'
    });
  }
}

/**
 * Export app functions to window
 */
if (typeof window !== 'undefined') {
  window.app = {
    selectTemplate,
    insertSnippet,
    clearReport,
    saveReport,
    switchSnippetCategory
  };
}

export default {
  initApp,
  selectTemplate,
  insertSnippet,
  clearReport,
  saveReport,
  switchSnippetCategory
};