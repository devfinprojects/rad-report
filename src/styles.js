/**
 * Styles Module - CSS Styles for the Application
 * Part of RadReport AI Frontend
 */

/**
 * Generates complete CSS styles for the application
 * @returns {string} CSS styles
 */
export function getStyles() {
  return `
/* CSS Variables - Theme Configuration */
:root {
  /* Colors - Primary */
  --primary: #2563eb;
  --primary-light: #3b82f6;
  --primary-dark: #1d4ed8;
  --primary-alpha: rgba(37, 99, 235, 0.1);

  /* Colors - Secondary */
  --secondary: #64748b;
  --secondary-light: #94a3b8;
  --secondary-dark: #475569;

  /* Colors - Status */
  --success: #10b981;
  --success-light: #34d399;
  --warning: #f59e0b;
  --warning-light: #fbbf24;
  --danger: #ef4444;
  --danger-light: #f87171;
  --info: #0ea5e9;

  /* Colors - Neutral */
  --bg: #f8fafc;
  --bg-alt: #f1f5f9;
  --surface: #ffffff;
  --surface-hover: #f8fafc;
  --border: #e2e8f0;
  --border-light: #f1f5f9;

  /* Colors - Text */
  --text: #1e293b;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --text-inverse: #ffffff;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 150ms;
  --transition: 200ms;
  --transition-slow: 300ms;

  /* Z-Index */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--text);
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }
h4 { font-size: var(--font-size-lg); }

p {
  margin-bottom: var(--space-4);
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--primary-dark);
}

/* Layout */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.grid {
  display: grid;
  gap: var(--space-6);
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

/* Card Component */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.card-body {
  padding: var(--space-4) 0;
}

.card-footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-light);
}

/* Button Components */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: var(--text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg);
  border-color: var(--secondary);
}

.btn-success {
  background: var(--success);
  color: var(--text-inverse);
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: var(--danger);
  color: var(--text-inverse);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
}

.btn-icon {
  padding: var(--space-2);
  width: 36px;
  height: 36px;
}

/* Form Components */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text);
  margin-bottom: var(--space-2);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-light);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: var(--font-mono);
}

.form-input-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
}

.form-help {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.form-error {
  font-size: var(--font-size-xs);
  color: var(--danger);
  margin-top: var(--space-1);
}

/* Checkbox & Radio */
.form-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.form-check-input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

/* Tabs */
.tabs {
  display: flex;
  gap: var(--space-2);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-4);
}

.tab {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab:hover {
  color: var(--text);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: var(--bg);
  color: var(--text-muted);
}

.badge-primary {
  background: var(--primary-alpha);
  color: var(--primary);
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* List */
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.list-item:hover {
  border-color: var(--primary);
  background: var(--primary-alpha);
}

.list-item.active {
  border-color: var(--primary);
  background: var(--primary-alpha);
}

/* Alert */
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius);
  margin-bottom: var(--space-4);
}

.alert-info {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  color: #0369a1;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #047857;
}

.alert-warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #b45309;
}

.alert-danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #b91c1c;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border);
}

/* Loading Spinner */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Utilities */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: var(--font-size-sm); }
.text-xs { font-size: var(--font-size-xs); }
.font-mono { font-family: var(--font-mono); }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }

.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }

.p-2 { padding: var(--space-2); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }

.w-full { width: 100%; }
.h-full { height: 100%; }

.hidden { display: none; }
.visible { visibility: visible; }
.invisible { visibility: hidden; }

.overflow-auto { overflow: auto; }
.overflow-hidden { overflow: hidden; }

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: var(--space-4);
  }

  .btn-lg {
    padding: var(--space-2) var(--space-4);
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-light);
}

/* Selection */
::selection {
  background: var(--primary-alpha);
  color: var(--primary-dark);
}

/* Focus Visible */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
`;
}

/**
 * Gets theme colors for JavaScript usage
 * @returns {Object} Theme colors
 */
export function getThemeColors() {
  return {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b'
  };
}

/**
 * Generates inline styles for specific components
 * @param {string} component - Component name
 * @param {Object} props - Component props
 * @returns {string} Inline styles
 */
export function getComponentStyles(component, props = {}) {
  switch (component) {
    case 'header':
      return `
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 100;
      `;
    case 'sidebar':
      return `
        width: 280px;
        background: var(--surface);
        border-right: 1px solid var(--border);
        height: calc(100vh - 73px);
        overflow-y: auto;
        position: sticky;
        top: 73px;
      `;
    case 'editor':
      return `
        font-family: var(--font-mono);
        font-size: 13px;
        line-height: 1.7;
        min-height: 300px;
        padding: 16px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        resize: vertical;
      `;
    case 'preview':
      return `
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 24px;
        min-height: 400px;
      `;
    default:
      return '';
  }
}

export default {
  getStyles,
  getThemeColors,
  getComponentStyles
};