/**
 * Router Module - HTTP Request Routing
 * Part of RadReport AI Integration
 */

import { createApiResponse, createListResponse, createPagination } from './data-models.js';
import { getTemplateData, templateData } from './template-data.js';
import { getSnippetData, snippetData } from './snippet-data.js';
import { searchTemplates as fuzzySearchTemplates, searchSnippets as fuzzySearchSnippets } from './fuzzy-search.js';
import { createReport, createTemplate, createSnippet } from './data-models.js';
import { generateUUID, generateReportId, generateTemplateId, generateSnippetId } from './id-generator.js';
import { getCurrentTimestamp } from './date-utils.js';
import { validateRequestBody, isValidModality, isValidBodyRegion, validatePagination } from './validators.js';
import { expandSnippet, getTriggerSuggestions } from './snippet-engine.js';
import { getTemplateChecklist, getChecklistStats } from './checklist-engine.js';
import { aggregateDashboard } from './dashboard-aggregator.js';

/**
 * Main request handler
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment
 * @param {Object} ctx - Context
 * @param {Object} config - Config
 * @returns {Response} HTTP response
 */
export async function handleRequest(request, env, ctx, config) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Route based on path and method
  try {
    // API Routes
    if (path.startsWith('/api/')) {
      return await handleAPI(request, url, method, env, config);
    }

    // Health check
    if (path === '/health' || path === '/') {
      return handleHealth();
    }

    // Dashboard
    if (path === '/dashboard') {
      return handleDashboard(env);
    }

    // Static or default - return app
    return handleApp(request);
  } catch (error) {
    console.error('Request error:', error);
    return handleError(error);
  }
}

/**
 * Handles API requests
 * @param {Request} request - HTTP request
 * @param {URL} url - Parsed URL
 * @param {string} method - HTTP method
 * @param {Object} env - Environment
 * @param {Object} config - Config
 * @returns {Response} HTTP response
 */
async function handleAPI(request, url, method, env, config) {
  const path = url.pathname.replace('/api/', '');
  const segments = path.split('/').filter(s => s);

  // Route: /api/templates
  if (segments[0] === 'templates') {
    return handleTemplates(method, segments, request, env);
  }

  // Route: /api/snippets
  if (segments[0] === 'snippets') {
    return handleSnippets(method, segments, request, env);
  }

  // Route: /api/reports
  if (segments[0] === 'reports') {
    return handleReports(method, segments, request, env);
  }

  // Route: /api/search
  if (segments[0] === 'search') {
    return handleSearch(method, request);
  }

  // Route: /api/dashboard
  if (segments[0] === 'dashboard') {
    return handleDashboardAPI(method, request, env);
  }

  // Route: /api/checklist
  if (segments[0] === 'checklist') {
    return handleChecklist(method, request);
  }

  // 404 for unknown API paths
  return new Response(JSON.stringify(createApiResponse(null, { code: 'NOT_FOUND', message: 'API endpoint not found' })), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles templates API
 * @param {string} method - HTTP method
 * @param {Array} segments - Path segments
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment
 * @returns {Response} HTTP response
 */
async function handleTemplates(method, segments, request, env) {
  // GET /api/templates - List templates
  if (method === 'GET') {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const modality = url.searchParams.get('modality') || '';
    const bodyRegion = url.searchParams.get('bodyRegion') || '';
    const pageParams = validatePagination(
      parseInt(url.searchParams.get('page') || '1'),
      parseInt(url.searchParams.get('limit') || '20')
    );

    let templates = templateData;

    // Apply filters
    if (modality) {
      templates = templates.filter(t => t.modality === modality);
    }
    if (bodyRegion) {
      templates = templates.filter(t => t.bodyRegion === bodyRegion);
    }
    if (query) {
      const results = fuzzySearchTemplates(templates, query);
      templates = results.map(r => r.item);
    }

    // Pagination
    const total = templates.length;
    const start = (pageParams.page - 1) * pageParams.limit;
    const paginated = templates.slice(start, start + pageParams.limit);

    return new Response(JSON.stringify(createListResponse(paginated, {
      page: pageParams.page,
      limit: pageParams.limit,
      total
    })), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /api/templates - Create template
  if (method === 'POST') {
    const body = await request.json();
    const validation = validateRequestBody(body, ['modality', 'bodyRegion', 'name', 'templateText']);

    if (!validation.isValid) {
      return new Response(JSON.stringify(createApiResponse(null, { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') })), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const template = createTemplate({
      id: generateTemplateId(body.modality),
      ...body,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    });

    return new Response(JSON.stringify(createApiResponse(template)), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return handleMethodNotAllowed();
}

/**
 * Handles snippets API
 * @param {string} method - HTTP method
 * @param {Array} segments - Path segments
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment
 * @returns {Response} HTTP response
 */
async function handleSnippets(method, segments, request, env) {
  // GET /api/snippets - List snippets
  if (method === 'GET') {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || '';
    const modality = url.searchParams.get('modality') || '';

    let snippets = snippetData;

    // Apply filters
    if (category) {
      snippets = snippets.filter(s => s.category === category);
    }
    if (modality) {
      snippets = snippets.filter(s => s.modalityTags.includes(modality));
    }
    if (query) {
      const results = fuzzySearchSnippets(snippets, query);
      snippets = results.map(r => r.item);
    }

    return new Response(JSON.stringify(createApiResponse(snippets)), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /api/snippets - Create snippet
  if (method === 'POST') {
    const body = await request.json();
    const validation = validateRequestBody(body, ['trigger', 'name', 'expansion', 'category']);

    if (!validation.isValid) {
      return new Response(JSON.stringify(createApiResponse(null, { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') })), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const snippet = createSnippet({
      id: generateSnippetId(body.category),
      ...body,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    });

    return new Response(JSON.stringify(createApiResponse(snippet)), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return handleMethodNotAllowed();
}

/**
 * Handles reports API
 * @param {string} method - HTTP method
 * @param {Array} segments - Path segments
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment
 * @returns {Response} HTTP response
 */
async function handleReports(method, segments, request, env) {
  // GET /api/reports - List reports
  if (method === 'GET') {
    const url = new URL(request.url);
    const pageParams = validatePagination(
      parseInt(url.searchParams.get('page') || '1'),
      parseInt(url.searchParams.get('limit') || '20')
    );

    return new Response(JSON.stringify(createListResponse([], {
      page: pageParams.page,
      limit: pageParams.limit,
      total: 0
    })), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /api/reports - Create report
  if (method === 'POST') {
    const body = await request.json();
    const validation = validateRequestBody(body, ['modality', 'bodyRegion']);

    if (!validation.isValid) {
      return new Response(JSON.stringify(createApiResponse(null, { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') })), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const report = createReport({
      id: generateReportId(),
      ...body,
      status: 'DRAFT',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    });

    return new Response(JSON.stringify(createApiResponse(report)), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return handleMethodNotAllowed();
}

/**
 * Handles search API
 * @param {string} method - HTTP method
 * @param {Request} request - HTTP request
 * @returns {Response} HTTP response
 */
async function handleSearch(method, request) {
  if (method !== 'GET') {
    return handleMethodNotAllowed();
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const type = url.searchParams.get('type') || 'all';

  if (!query) {
    return new Response(JSON.stringify(createApiResponse(null, { code: 'MISSING_QUERY', message: 'Search query is required' })), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = {
    templates: [],
    snippets: []
  };

  if (type === 'all' || type === 'templates') {
    const templateResults = fuzzySearchTemplates(templateData, query);
    results.templates = templateResults.slice(0, 20).map(r => ({ id: r.item.id, name: r.item.name, modality: r.item.modality, bodyRegion: r.item.bodyRegion }));
  }

  if (type === 'all' || type === 'snippets') {
    const snippetResults = fuzzySearchSnippets(snippetData, query);
    results.snippets = snippetResults.slice(0, 20).map(r => ({ id: r.item.id, name: r.item.name, trigger: r.item.trigger, category: r.item.category }));
  }

  return new Response(JSON.stringify(createApiResponse(results)), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles dashboard API
 * @param {string} method - HTTP method
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment
 * @returns {Response} HTTP response
 */
async function handleDashboardAPI(method, request, env) {
  if (method !== 'GET') {
    return handleMethodNotAllowed();
  }

  const stats = await aggregateDashboard(env.REPORTS);

  return new Response(JSON.stringify(createApiResponse(stats)), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles checklist API
 * @param {string} method - HTTP method
 * @param {Request} request - HTTP request
 * @returns {Response} HTTP response
 */
async function handleChecklist(method, request) {
  if (method !== 'POST') {
    return handleMethodNotAllowed();
  }

  const body = await request.json();
  const { templateId, bodyRegion } = body;

  // Find template or create default checklist
  const template = templateData.find(t => t.id === templateId);
  const checklist = template ? getTemplateChecklist(template) : [];

  return new Response(JSON.stringify(createApiResponse({
    templateId,
    bodyRegion,
    checklist,
    stats: getChecklistStats(checklist)
  })), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles health check
 * @returns {Response} Health response
 */
function handleHealth() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: getCurrentTimestamp(),
    version: '1.0.0'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles dashboard page
 * @param {Object} env - Environment
 * @returns {Response} Dashboard response
 */
function handleDashboard(env) {
  return new Response(JSON.stringify({
    message: 'Dashboard endpoint - use /api/dashboard for statistics'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles app (frontend)
 * @param {Request} request - HTTP request
 * @returns {Response} App response
 */
function handleApp(request) {
  // Import and return the app HTML
  return new Response(getAppHTML(), {
    headers: { 'Content-Type': 'text/html' }
  });
}

/**
 * Generates the app HTML
 * @returns {string} HTML string
 */
function getAppHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RadReport AI</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #64748b;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-muted: #64748b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; margin: -20px -20px 20px; }
    .logo { font-size: 24px; font-weight: 700; color: var(--primary); }
    .nav { display: flex; gap: 16px; }
    .nav a { color: var(--text-muted); text-decoration: none; padding: 8px 16px; border-radius: 6px; transition: all 0.2s; }
    .nav a:hover, .nav a.active { background: var(--primary); color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-title { font-size: 18px; font-weight: 600; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-secondary { background: var(--bg); color: var(--text); border: 1px solid var(--border); }
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--text); }
    .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; background: var(--surface); }
    .form-textarea { min-height: 200px; resize: vertical; font-family: monospace; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: var(--text); }
    .template-list { display: flex; flex-direction: column; gap: 8px; }
    .template-item { padding: 12px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .template-item:hover { border-color: var(--primary); background: var(--bg); }
    .template-item.selected { border-color: var(--primary); background: #eff6ff; }
    .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
    .tab { padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; background: var(--surface); }
    .tab.active { background: var(--primary); color: white; border-color: var(--primary); }
    .snippet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
    .snippet-item { padding: 8px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 13px; }
    .snippet-item:hover { border-color: var(--primary); }
    .report-preview { background: var(--bg); padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat-card { background: var(--bg); padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--primary); }
    .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; }
    .search-box { position: relative; }
    .search-input { width: 100%; padding: 12px 16px; padding-left: 40px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">RadReport AI</div>
    <nav class="nav">
      <a href="#" class="active" data-view="create">Create Report</a>
      <a href="#" data-view="templates">Templates</a>
      <a href="#" data-view="snippets">Snippets</a>
      <a href="#" data-view="dashboard">Dashboard</a>
    </nav>
  </div>
  <div class="container">
    <div id="app"></div>
  </div>
  <script>
    const app = document.getElementById('app');
    
    function renderCreateReport() {
      app.innerHTML = \`
        <div class="grid">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Report Editor</h2>
            </div>
            <div class="form-group">
              <label class="form-label">Modality</label>
              <select class="form-select" id="modality">
                <option value="">Select Modality</option>
                <option value="CT">CT</option>
                <option value="MRI">MRI</option>
                <option value="X-RAY">X-RAY</option>
                <option value="ULTRASOUND">ULTRASOUND</option>
                <option value="MAMMOGRAPHY">MAMMOGRAPHY</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Body Region</label>
              <select class="form-select" id="bodyRegion">
                <option value="">Select Body Region</option>
                <option value="HEAD">HEAD</option>
                <option value="CHEST">CHEST</option>
                <option value="ABDOMEN">ABDOMEN</option>
                <option value="PELVIS">PELVIS</option>
                <option value="SPINE">SPINE</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Search Templates</label>
              <div class="search-box">
                <input type="text" class="search-input" id="templateSearch" placeholder="Search templates...">
              </div>
              <div id="templateResults" class="template-list" style="margin-top: 12px;"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Snippets</label>
              <div class="tabs">
                <button class="tab active" data-category="ANATOMY">Anatomy</button>
                <button class="tab" data-category="FINDING">Findings</button>
                <button class="tab" data-category="TECHNIQUE">Technique</button>
                <button class="tab" data-category="MODIFIER">Modifiers</button>
              </div>
              <div id="snippetResults" class="snippet-grid"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Report Preview</h2>
              <div>
                <button class="btn btn-secondary" onclick="clearReport()">Clear</button>
                <button class="btn btn-primary" onclick="saveReport()">Save Report</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Clinical History</label>
              <textarea class="form-textarea" id="clinicalHistory" rows="3" placeholder="Enter clinical history..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Technique</label>
              <textarea class="form-textarea" id="technique" rows="5" placeholder="Technique..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Findings</label>
              <textarea class="form-textarea" id="findings" rows="8" placeholder="Findings..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Impression</label>
              <textarea class="form-textarea" id="impression" rows="5" placeholder="Impression..."></textarea>
            </div>
          </div>
        </div>
      \`;
      initCreateReport();
    }
    
    function initCreateReport() {
      document.getElementById('templateSearch').addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 2) return;
        const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}&type=templates\`);
        const data = await res.json();
        const results = data.data?.templates || [];
        const container = document.getElementById('templateResults');
        container.innerHTML = results.slice(0, 10).map(t => \`
          <div class="template-item" onclick="selectTemplate('\${t.id}', '\${t.name}', '\${t.modality}', '\${t.bodyRegion}')">
            <strong>\${t.name}</strong>
            <div style="font-size: 12px; color: var(--text-muted);">\${t.modality} | \${t.bodyRegion}</div>
          </div>
        \`).join('');
      });
      
      loadSnippets('ANATOMY');
      
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          loadSnippets(tab.dataset.category);
        });
      });
    }
    
    async function loadSnippets(category) {
      const res = await fetch(\`/api/snippets?category=\${category}\`);
      const data = await res.json();
      const snippets = data.data || [];
      const container = document.getElementById('snippetResults');
      container.innerHTML = snippets.slice(0, 30).map(s => \`
        <div class="snippet-item" onclick="insertSnippet('\${s.trigger}')" title="\${s.expansion}">
          <strong>\${s.trigger}</strong> - \${s.name}
        </div>
      \`).join('');
    }
    
    function selectTemplate(id, name, modality, bodyRegion) {
      document.getElementById('modality').value = modality;
      document.getElementById('bodyRegion').value = bodyRegion;
      document.getElementById('findings').value = 'Template: ' + name + '\\n\\n';
    }
    
    function insertSnippet(trigger) {
      const findings = document.getElementById('findings');
      findings.value += '\\n' + trigger + ' ';
      findings.focus();
    }
    
    async function saveReport() {
      const report = {
        modality: document.getElementById('modality').value,
        bodyRegion: document.getElementById('bodyRegion').value,
        clinicalHistory: document.getElementById('clinicalHistory').value,
        technique: document.getElementById('technique').value,
        findings: document.getElementById('findings').value,
        impression: document.getElementById('impression').value
      };
      
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      
      const data = await res.json();
      if (data.success) {
        alert('Report saved successfully!');
      } else {
        alert('Error saving report: ' + data.error.message);
      }
    }
    
    function clearReport() {
      document.getElementById('clinicalHistory').value = '';
      document.getElementById('technique').value = '';
      document.getElementById('findings').value = '';
      document.getElementById('impression').value = '';
    }
    
    function renderTemplates() {
      app.innerHTML = \`
        <div class="card">
          <h2 class="card-title">Templates</h2>
          <div class="search-box">
            <input type="text" class="search-input" id="templateSearchPage" placeholder="Search templates...">
          </div>
          <div id="templatesContainer" class="template-list" style="margin-top: 16px;"></div>
        </div>
      \`;
      loadTemplates();
    }
    
    async function loadTemplates() {
      const res = await fetch('/api/templates');
      const data = await res.json();
      const templates = data.data?.items || [];
      const container = document.getElementById('templatesContainer');
      container.innerHTML = templates.map(t => \`
        <div class="template-item">
          <strong>\${t.name}</strong>
          <div style="font-size: 12px; color: var(--text-muted);">\${t.modality} | \${t.bodyRegion} | \${t.system}</div>
        </div>
      \`).join('');
    }
    
    function renderSnippets() {
      app.innerHTML = \`
        <div class="card">
          <h2 class="card-title">Snippets</h2>
          <div class="search-box">
            <input type="text" class="search-input" id="snippetSearchPage" placeholder="Search snippets...">
          </div>
          <div class="tabs" style="margin-top: 16px;">
            <button class="tab active" data-category="ANATOMY">Anatomy</button>
            <button class="tab" data-category="FINDING">Findings</button>
            <button class="tab" data-category="TECHNIQUE">Technique</button>
            <button class="tab" data-category="PATHOLOGY">Pathology</button>
            <button class="tab" data-category="MODIFIER">Modifiers</button>
          </div>
          <div id="snippetsContainer" class="snippet-grid" style="margin-top: 16px;"></div>
        </div>
      \`;
      loadSnippetsPage('ANATOMY');
      
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          loadSnippetsPage(tab.dataset.category);
        });
      });
    }
    
    async function loadSnippetsPage(category) {
      const res = await fetch(\`/api/snippets?category=\${category}\`);
      const data = await res.json();
      const snippets = data.data || [];
      const container = document.getElementById('snippetsContainer');
      container.innerHTML = snippets.map(s => \`
        <div class="snippet-item">
          <strong>\${s.trigger}</strong>
          <div style="font-size: 12px; color: var(--text-muted);">\${s.name}</div>
        </div>
      \`).join('');
    }
    
    async function renderDashboard() {
      app.innerHTML = '<div class="card"><h2>Loading dashboard...</h2></div>';
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      const stats = data.data || {};
      
      app.innerHTML = \`
        <div class="card">
          <h2 class="card-title">Dashboard</h2>
          <div class="stats-grid" style="margin-bottom: 24px;">
            <div class="stat-card">
              <div class="stat-value">\${stats.totalReports || 0}</div>
              <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">\${Object.keys(stats.reportsByModality || {}).length}</div>
              <div class="stat-label">Modalities</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">\${stats.averageReportLength || 0}</div>
              <div class="stat-label">Avg. Length (chars)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">\${Object.keys(stats.reportsByStatus || {}).length}</div>
              <div class="stat-label">Statuses</div>
            </div>
          </div>
          <h3 class="section-title">Reports by Modality</h3>
          <pre style="background: var(--bg); padding: 16px; border-radius: 8px; font-size: 13px;">\${JSON.stringify(stats.reportsByModality || {}, null, 2)}</pre>
        </div>
      \`;
    }
    
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const view = link.dataset.view;
        if (view === 'create') renderCreateReport();
        else if (view === 'templates') renderTemplates();
        else if (view === 'snippets') renderSnippets();
        else if (view === 'dashboard') renderDashboard();
      });
    });
    
    renderCreateReport();
  </script>
</body>
</html>`;
}

/**
 * Handles errors
 * @param {Error} error - Error object
 * @returns {Response} Error response
 */
function handleError(error) {
  return new Response(JSON.stringify(createApiResponse(null, { code: 'INTERNAL_ERROR', message: error.message })), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles method not allowed
 * @returns {Response} 405 response
 */
function handleMethodNotAllowed() {
  return new Response(JSON.stringify(createApiResponse(null, { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' })), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}

export default {
  handleRequest
};