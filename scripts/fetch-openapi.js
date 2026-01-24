#!/usr/bin/env node

/**
 * Fetches OpenAPI specification from the backend API
 * This script automates the process of keeping frontend types in sync with the backend
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
// Try multiple possible backend URLs in order of preference
const BACKEND_URL =
  process.env.BACKEND_URL || // Custom backend URL for OpenAPI fetch
  process.env.VITE_API_URL?.replace('/api', '') || // Remove /api suffix if present
  'http://localhost:5072'; // Default ASP.NET Core port

const OPENAPI_ENDPOINT = process.env.OPENAPI_ENDPOINT || '/swagger/v1/swagger.json';
const OUTPUT_PATH = join(__dirname, '..', 'openapi.json');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function fetchOpenAPI() {
  const url = `${BACKEND_URL}${OPENAPI_ENDPOINT}`;

  console.log(`${colors.cyan}🔍 Fetching OpenAPI spec from: ${url}${colors.reset}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const openApiSpec = await response.json();

    // Write to file
    writeFileSync(OUTPUT_PATH, JSON.stringify(openApiSpec, null, 2), 'utf-8');

    console.log(`${colors.green}✅ OpenAPI spec saved to: openapi.json${colors.reset}`);
    console.log(`${colors.green}✨ Run 'npm run generate-types' to update TypeScript types${colors.reset}`);

    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Failed to fetch OpenAPI spec${colors.reset}`);
    console.error(`${colors.red}   Error: ${error.message}${colors.reset}`);
    console.error('');
    console.error(`${colors.yellow}💡 Troubleshooting:${colors.reset}`);
    console.error(`   1. Make sure your backend is running at ${BACKEND_URL}`);
    console.error(`   2. Check that Swagger is enabled in your ASP.NET Core app`);
    console.error(`   3. Verify the Swagger endpoint: ${OPENAPI_ENDPOINT}`);
    console.error(`   4. Set VITE_API_URL environment variable if using a different URL`);
    console.error('');
    console.error(`${colors.yellow}   If the endpoint is different, update OPENAPI_ENDPOINT in:${colors.reset}`);
    console.error(`   ${colors.cyan}scripts/fetch-openapi.js${colors.reset}`);

    process.exit(1);
  }
}

// Run the script
fetchOpenAPI();
