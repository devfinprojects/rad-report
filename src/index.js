/**
 * RadReport AI - Main Entry Point
 * Cloudflare Worker for Radiology Report Generation
 * Version: 1.0.0
 */

import { handleRequest } from './router.js';
import { validateEnvironment } from './validators.js';
import { getConfig } from './config-manager.js';

/**
 * Main request handler for the Cloudflare Worker
 * @param {Request} request - The incoming request
 * @param {ExecutionContext} env - Cloudflare execution context
 * @returns {Response} The HTTP response
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // Validate environment configuration
      const configError = validateEnvironment(env);
      if (configError) {
        return new Response(JSON.stringify({
          error: 'Configuration Error',
          message: configError,
          status: 500
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get configuration
      const config = getConfig(env);

      // Handle the request through the router
      return await handleRequest(request, env, ctx, config);
    } catch (error) {
      console.error('Unhandled error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        status: 500
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Module exports for testing
 */
export {
  handleRequest,
  validateEnvironment,
  getConfig
};