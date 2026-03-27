/**
 * Dashboard Aggregator Module - Statistics and Dashboard Data
 * Part of RadReport AI Engine Components
 */

import { getAllReports, getAllTemplates, getAllSnippets } from './kv-store.js';
import { getCurrentDate, startOfMonth, endOfMonth, getDaysDifference } from './date-utils.js';

/**
 * Aggregates dashboard statistics
 * @param {Object} kv - KV store
 * @param {Object} options - Aggregation options
 * @returns {Object} Dashboard data
 */
export async function aggregateDashboard(kv, options = {}) {
  const {
    period = 'DAILY',
    startDate = getCurrentDate(),
    endDate = getCurrentDate()
  } = options;

  const reports = await getAllReports(kv);
  const templates = await getAllTemplates(kv);
  const snippets = await getAllSnippets(kv);

  // Filter by date range
  const filteredReports = filterByDateRange(reports, startDate, endDate);

  const stats = {
    totalReports: filteredReports.length,
    reportsByModality: aggregateByModality(filteredReports),
    reportsByStatus: aggregateByStatus(filteredReports),
    reportsByBodyRegion: aggregateByBodyRegion(filteredReports),
    averageReportLength: calculateAverageLength(filteredReports),
    topTemplates: getTopTemplates(filteredReports, templates),
    topSnippets: getTopSnippets(filteredReports, snippets),
    period: {
      period,
      startDate,
      endDate,
      daysCount: getDaysDifference(startDate, endDate) + 1
    },
    generatedAt: new Date().toISOString()
  };

  return stats;
}

/**
 * Filters reports by date range
 * @param {Array} reports - Reports array
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Array} Filtered reports
 */
function filterByDateRange(reports, startDate, endDate) {
  return reports.filter(r => {
    const reportDate = new Date(r.createdAt);
    return reportDate >= new Date(startDate) && reportDate <= new Date(endDate + 'T23:59:59');
  });
}

/**
 * Aggregates reports by modality
 * @param {Array} reports - Reports array
 * @returns {Object} Modality counts
 */
function aggregateByModality(reports) {
  const counts = {};
  for (const report of reports) {
    const modality = report.modality || 'UNKNOWN';
    counts[modality] = (counts[modality] || 0) + 1;
  }
  return counts;
}

/**
 * Aggregates reports by status
 * @param {Array} reports - Reports array
 * @returns {Object} Status counts
 */
function aggregateByStatus(reports) {
  const counts = {};
  for (const report of reports) {
    const status = report.status || 'UNKNOWN';
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts;
}

/**
 * Aggregates reports by body region
 * @param {Array} reports - Reports array
 * @returns {Object} Body region counts
 */
function aggregateByBodyRegion(reports) {
  const counts = {};
  for (const report of reports) {
    const region = report.bodyRegion || 'UNKNOWN';
    counts[region] = (counts[region] || 0) + 1;
  }
  return counts;
}

/**
 * Calculates average report length
 * @param {Array} reports - Reports array
 * @returns {number} Average length
 */
function calculateAverageLength(reports) {
  if (reports.length === 0) return 0;
  
  let totalLength = 0;
  for (const report of reports) {
    const text = `${report.findings || ''} ${report.impression || ''}`;
    totalLength += text.length;
  }
  
  return Math.round(totalLength / reports.length);
}

/**
 * Gets top used templates
 * @param {Array} reports - Reports array
 * @param {Array} templates - Templates array
 * @param {number} limit - Number to return
 * @returns {Array} Top templates
 */
function getTopTemplates(reports, templates, limit = 10) {
  const usageCounts = {};
  
  for (const report of reports) {
    if (report.templateId) {
      usageCounts[report.templateId] = (usageCounts[report.templateId] || 0) + 1;
    }
  }

  const sorted = Object.entries(usageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted.map(([templateId, count]) => {
    const template = templates.find(t => t.id === templateId);
    return {
      templateId,
      name: template?.name || 'Unknown',
      count
    };
  });
}

/**
 * Gets top used snippets
 * @param {Array} reports - Reports array
 * @param {Array} snippets - Snippets array
 * @param {number} limit - Number to return
 * @returns {Array} Top snippets
 */
function getTopSnippets(reports, snippets, limit = 10) {
  const usageCounts = {};
  
  for (const report of reports) {
    if (report.snippetIds && Array.isArray(report.snippetIds)) {
      for (const snippetId of report.snippetIds) {
        usageCounts[snippetId] = (usageCounts[snippetId] || 0) + 1;
      }
    }
  }

  const sorted = Object.entries(usageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted.map(([snippetId, count]) => {
    const snippet = snippets.find(s => s.id === snippetId);
    return {
      snippetId,
      trigger: snippet?.trigger || 'Unknown',
      name: snippet?.name || 'Unknown',
      count
    };
  });
}

/**
 * Gets daily statistics
 * @param {Object} kv - KV store
 * @param {string} date - Date string
 * @returns {Object} Daily stats
 */
export async function getDailyStats(kv, date = getCurrentDate()) {
  return aggregateDashboard(kv, {
    period: 'DAILY',
    startDate: date,
    endDate: date
  });
}

/**
 * Gets monthly statistics
 * @param {Object} kv - KV store
 * @param {string} yearMonth - Year-month string (YYYY-MM)
 * @returns {Object} Monthly stats
 */
export async function getMonthlyStats(kv, yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return aggregateDashboard(kv, {
    period: 'MONTHLY',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  });
}

/**
 * Gets report trends over time
 * @param {Array} reports - Reports array
 * @param {number} days - Number of days to analyze
 * @returns {Array} Trend data
 */
export function getReportTrends(reports, days = 30) {
  const trends = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = reports.filter(r => r.createdAt.startsWith(dateStr)).length;
    
    trends.push({
      date: dateStr,
      count
    });
  }
  
  return trends;
}

/**
 * Gets modality distribution
 * @param {Array} reports - Reports array
 * @returns {Array} Distribution data
 */
export function getModalityDistribution(reports) {
  const distribution = aggregateByModality(reports);
  const total = reports.length;
  
  return Object.entries(distribution).map(([modality, count]) => ({
    modality,
    count,
    percentage: Math.round((count / total) * 100)
  }));
}

/**
 * Gets status distribution
 * @param {Array} reports - Reports array
 * @returns {Array} Distribution data
 */
export function getStatusDistribution(reports) {
  const distribution = aggregateByStatus(reports);
  const total = reports.length;
  
  return Object.entries(distribution).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / total) * 100)
  }));
}

/**
 * Calculates productivity metrics
 * @param {Array} reports - Reports array
 * @param {number} days - Number of days
 * @returns {Object} Productivity metrics
 */
export function calculateProductivity(reports, days = 30) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  
  const periodReports = reports.filter(r => new Date(r.createdAt) >= startDate);
  
  const completed = periodReports.filter(r => r.status === 'SIGNED' || r.status === 'REVIEWED').length;
  const pending = periodReports.filter(r => r.status === 'DRAFT' || r.status === 'PENDING_REVIEW').length;
  const total = periodReports.length;
  
  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    averagePerDay: Math.round(total / days * 10) / 10,
    period: `${days} days`
  };
}

export default {
  aggregateDashboard,
  getDailyStats,
  getMonthlyStats,
  getReportTrends,
  getModalityDistribution,
  getStatusDistribution,
  calculateProductivity
};