/**
 * HTML Module - HTML Generation and Templates
 * Part of RadReport AI Frontend
 */

/**
 * Generates complete HTML document
 * @param {Object} options - HTML options
 * @returns {string} Complete HTML document
 */
export function generateHTML(options = {}) {
  const {
    title = 'RadReport AI',
    styles = '',
    scripts = '',
    body = ''
  } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="RadReport AI - Radiology Report Generation Tool">
  <title>${title}</title>
  <style>${styles}</style>
</head>
<body>
  ${body}
  <script>${scripts}</script>
</body>
</html>`;
}

/**
 * Generates header HTML
 * @param {Object} options - Header options
 * @returns {string} Header HTML
 */
export function generateHeader(options = {}) {
  const { logo = 'RadReport AI', nav = [], user = null } = options;

  const navItems = nav.map(item => `
    <a href="${item.href}" class="${item.active ? 'active' : ''}" data-view="${item.view}">
      ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
      ${item.label}
    </a>
  `).join('');

  const userSection = user ? `
    <div class="user-menu">
      <span class="user-name">${user.name}</span>
      <button class="btn btn-secondary btn-sm" onclick="handleLogout()">Logout</button>
    </div>
  ` : '';

  return `
    <header class="app-header">
      <div class="header-left">
        <div class="logo">${logo}</div>
      </div>
      <nav class="header-nav">
        ${navItems}
      </nav>
      <div class="header-right">
        ${userSection}
      </div>
    </header>
  `;
}

/**
 * Generates main layout HTML
 * @param {Object} options - Layout options
 * @returns {string} Layout HTML
 */
export function generateLayout(options = {}) {
  const { header = '', sidebar = '', content = '', footer = '' } = options;

  return `
    <div class="app-layout">
      ${header}
      <div class="app-body">
        ${sidebar ? `<aside class="app-sidebar">${sidebar}</aside>` : ''}
        <main class="app-content">${content}</main>
      </div>
      ${footer}
    </div>
  `;
}

/**
 * Generates form field HTML
 * @param {Object} options - Field options
 * @returns {string} Field HTML
 */
export function generateField(options = {}) {
  const {
    type = 'text',
    name,
    label,
    value = '',
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    help = '',
    options: selectOptions = []
  } = options;

  let inputHtml = '';

  switch (type) {
    case 'select':
      inputHtml = `
        <select class="form-input" name="${name}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>
          <option value="">Select...</option>
          ${selectOptions.map(opt => `
            <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
              ${opt.label}
            </option>
          `).join('')}
        </select>
      `;
      break;
    case 'textarea':
      inputHtml = `
        <textarea class="form-textarea" name="${name}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''} placeholder="${placeholder}">${value}</textarea>
      `;
      break;
    case 'checkbox':
      inputHtml = `
        <label class="form-check">
          <input type="checkbox" class="form-check-input" name="${name}" ${value ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
          ${label}
        </label>
      `;
      break;
    default:
      inputHtml = `
        <input type="${type}" class="form-input" name="${name}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>
      `;
  }

  if (type === 'checkbox') {
    return inputHtml;
  }

  return `
    <div class="form-group">
      ${label ? `<label class="form-label" for="${name}">${label}${required ? ' *' : ''}</label>` : ''}
      ${inputHtml}
      ${error ? `<div class="form-error">${error}</div>` : ''}
      ${help ? `<div class="form-help">${help}</div>` : ''}
    </div>
  `;
}

/**
 * Generates button HTML
 * @param {Object} options - Button options
 * @returns {string} Button HTML
 */
export function generateButton(options = {}) {
  const {
    type = 'button',
    label,
    variant = 'primary',
    size = 'md',
    icon = '',
    disabled = false,
    loading = false,
    onclick = ''
  } = options;

  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : ''
  ].filter(Boolean).join(' ');

  const iconHtml = loading 
    ? '<span class="spinner"></span>' 
    : (icon ? `<span class="btn-icon">${icon}</span>` : '');

  return `
    <button type="${type}" class="${classes}" ${disabled ? 'disabled' : ''} ${onclick ? `onclick="${onclick}"` : ''}>
      ${iconHtml}
      ${label}
    </button>
  `;
}

/**
 * Generates card HTML
 * @param {Object} options - Card options
 * @returns {string} Card HTML
 */
export function generateCard(options = {}) {
  const {
    title = '',
    subtitle = '',
    header = '',
    body = '',
    footer = '',
    image = '',
    actions = []
  } = options;

  const headerHtml = header || (title ? `
    <div class="card-header">
      <div>
        ${title ? `<h3 class="card-title">${title}</h3>` : ''}
        ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
      </div>
      ${actions.length > 0 ? `
        <div class="card-actions">
          ${actions.map(btn => generateButton(btn)).join('')}
        </div>
      ` : ''}
    </div>
  ` : '');

  return `
    <div class="card">
      ${headerHtml}
      ${image ? `<div class="card-image">${image}</div>` : ''}
      ${body ? `<div class="card-body">${body}</div>` : ''}
      ${footer ? `<div class="card-footer">${footer}</div>` : ''}
    </div>
  `;
}

/**
 * Generates modal HTML
 * @param {Object} options - Modal options
 * @returns {string} Modal HTML
 */
export function generateModal(options = {}) {
  const {
    id = 'modal',
    title = '',
    body = '',
    footer = '',
    size = 'md',
    closable = true
  } = options;

  return `
    <div class="modal-backdrop" id="${id}-backdrop" style="display: none;">
      <div class="modal modal-${size}" role="dialog" aria-labelledby="${id}-title">
        <div class="modal-header">
          <h3 class="modal-title" id="${id}-title">${title}</h3>
          ${closable ? `
            <button class="btn btn-icon" onclick="closeModal('${id}')" aria-label="Close">
              ✕
            </button>
          ` : ''}
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Generates alert HTML
 * @param {Object} options - Alert options
 * @returns {string} Alert HTML
 */
export function generateAlert(options = {}) {
  const {
    type = 'info',
    title = '',
    message = '',
    dismissible = true
  } = options;

  return `
    <div class="alert alert-${type}" role="alert">
      ${title ? `<strong>${title}</strong>` : ''}
      ${message}
      ${dismissible ? `
        <button class="alert-dismiss" onclick="this.parentElement.remove()">✕</button>
      ` : ''}
    </div>
  `;
}

/**
 * Generates tabs HTML
 * @param {Object} options - Tabs options
 * @returns {string} Tabs HTML
 */
export function generateTabs(options = {}) {
  const { tabs = [], active = 0 } = options;

  return `
    <div class="tabs">
      ${tabs.map((tab, i) => `
        <button class="tab ${i === active ? 'active' : ''}" data-tab="${i}" onclick="switchTab(${i})">
          ${tab.icon ? `<span>${tab.icon}</span>` : ''}
          ${tab.label}
        </button>
      `).join('')}
    </div>
    <div class="tab-content">
      ${tabs.map((tab, i) => `
        <div class="tab-pane ${i === active ? 'active' : ''}" data-tab="${i}">
          ${tab.content}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Generates table HTML
 * @param {Object} options - Table options
 * @returns {string} Table HTML
 */
export function generateTable(options = {}) {
  const {
    columns = [],
    data = [],
    striped = true,
    bordered = false,
    hover = true,
    emptyMessage = 'No data'
  } = options;

  if (data.length === 0) {
    return `<div class="table-empty">${emptyMessage}</div>`;
  }

  const thead = `
    <thead>
      <tr>
        ${columns.map(col => `<th>${col.label}</th>`).join('')}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${data.map(row => `
        <tr>
          ${columns.map(col => `
            <td>${col.render ? col.render(row[col.key], row) : row[col.key]}</td>
          `).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  const classes = [
    'table',
    striped ? 'table-striped' : '',
    bordered ? 'table-bordered' : '',
    hover ? 'table-hover' : ''
  ].filter(Boolean).join(' ');

  return `
    <table class="${classes}">
      ${thead}
      ${tbody}
    </table>
  `;
}

/**
 * Generates loading spinner HTML
 * @param {Object} options - Spinner options
 * @returns {string} Spinner HTML
 */
export function generateSpinner(options = {}) {
  const { size = 'md', label = 'Loading...' } = options;

  return `
    <div class="spinner-container">
      <div class="spinner spinner-${size}"></div>
      ${label ? `<p class="spinner-label">${label}</p>` : ''}
    </div>
  `;
}

/**
 * Generates breadcrumb HTML
 * @param {Array} items - Breadcrumb items
 * @returns {string} Breadcrumb HTML
 */
export function generateBreadcrumb(items = []) {
  return `
    <nav class="breadcrumb">
      ${items.map((item, i) => `
        ${i > 0 ? '<span class="breadcrumb-separator">/</span>' : ''}
        ${item.href 
          ? `<a href="${item.href}" class="breadcrumb-item">${item.label}</a>`
          : `<span class="breadcrumb-item breadcrumb-current">${item.label}</span>`
        }
      `).join('')}
    </nav>
  `;
}

/**
 * Generates tooltip HTML
 * @param {string} content - Tooltip content
 * @param {string} position - Position (top, bottom, left, right)
 * @returns {string} Tooltip HTML
 */
export function generateTooltip(content, position = 'top') {
  return `<span class="tooltip" data-tooltip="${content}" data-position="${position}">?</span>`;
}

/**
 * Generates badge HTML
 * @param {Object} options - Badge options
 * @returns {string} Badge HTML
 */
export function generateBadge(options = {}) {
  const { label, variant = 'default', pill = false } = options;

  return `<span class="badge badge-${variant} ${pill ? 'badge-pill' : ''}">${label}</span>`;
}

/**
 * Generates progress bar HTML
 * @param {Object} options - Progress options
 * @returns {string} Progress HTML
 */
export function generateProgress(options = {}) {
  const { value = 0, max = 100, label = '', showPercent = true, variant = 'primary' } = options;

  const percent = Math.round((value / max) * 100);

  return `
    <div class="progress">
      ${label || showPercent ? `
        <div class="progress-label">
          ${label} <span class="progress-percent">${percent}%</span>
        </div>
      ` : ''}
      <div class="progress-bar">
        <div class="progress-fill progress-${variant}" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

export default {
  generateHTML,
  generateHeader,
  generateLayout,
  generateField,
  generateButton,
  generateCard,
  generateModal,
  generateAlert,
  generateTabs,
  generateTable,
  generateSpinner,
  generateBreadcrumb,
  generateTooltip,
  generateBadge,
  generateProgress
};