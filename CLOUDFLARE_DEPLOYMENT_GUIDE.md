# Cloudflare Workers Deployment Guide - KV Namespace Binding

## Current Issue
Your `wrangler.toml` file has **placeholder KV namespace IDs** that need to be replaced with real IDs from your Cloudflare account.

## Step-by-Step Deployment Process

### Step 1: Create KV Namespaces in Cloudflare Dashboard

1. **Log into Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **KV**

2. **Create 5 KV Namespaces** (one for each binding):
   
   Create these namespaces:
   - `TEMPLATES` - for storing report templates
   - `SNIPPETS` - for storing report snippets
   - `REPORTS` - for storing generated reports
   - `SESSIONS` - for managing user sessions
   - `USAGE` - for tracking API usage

   For each namespace:
   - Click **"Create namespace"**
   - Enter the name (e.g., `TEMPLATES`)
   - Click **"Create"**
   - **Copy the Namespace ID** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Get Preview Namespace IDs

For each namespace, you also need a **preview ID**:

1. In the KV dashboard, click on each namespace
2. Go to **Settings** tab
3. Find **"Preview ID"** and copy it
4. This is used for `wrangler dev` (local development)

### Step 3: Update wrangler.toml

Replace the placeholder IDs in your `wrangler.toml` file with the real IDs:

```toml
[[kv_namespaces]]
binding = "TEMPLATES"
id = "YOUR_REAL_TEMPLATES_NAMESPACE_ID"
preview_id = "YOUR_REAL_TEMPLATES_PREVIEW_ID"

[[kv_namespaces]]
binding = "SNIPPETS"
id = "YOUR_REAL_SNIPPETS_NAMESPACE_ID"
preview_id = "YOUR_REAL_SNIPPETS_PREVIEW_ID"

[[kv_namespaces]]
binding = "REPORTS"
id = "YOUR_REAL_REPORTS_NAMESPACE_ID"
preview_id = "YOUR_REAL_REPORTS_PREVIEW_ID"

[[kv_namespaces]]
binding = "SESSIONS"
id = "YOUR_REAL_SESSIONS_NAMESPACE_ID"
preview_id = "YOUR_REAL_SESSIONS_PREVIEW_ID"

[[kv_namespaces]]
binding = "USAGE"
id = "YOUR_REAL_USAGE_NAMESPACE_ID"
preview_id = "YOUR_REAL_USAGE_PREVIEW_ID"
```

### Step 4: Authenticate with Cloudflare

Run this command to authenticate wrangler with your Cloudflare account:

```bash
npx wrangler login
```

This will open a browser window for you to log in.

### Step 5: Deploy to Cloudflare Workers

Once you've updated the namespace IDs and authenticated:

```bash
npx wrangler deploy
```

### Step 6: Verify Deployment

After deployment, you'll see output like:
```
Published radreport-ai-prod (2.34 sec)
  https://radreport-ai-prod.YOUR_SUBDOMAIN.workers.dev
```

Visit the URL to verify your worker is running.

## Environment Variables

Your `wrangler.toml` already has environment variables configured:

```toml
[vars]
ENVIRONMENT = "development"
API_VERSION = "1.0.0"
MAX_TEMPLATE_SIZE = 50000
MAX_SNIPPET_SIZE = 10000
DEFAULT_MODALITY = "CT"
DEFAULT_SYSTEM = "BODY"
ENABLE_STREAMING = "true"
ENABLE_DEBUG = "false"
RATE_LIMIT_REQUESTS = "100"
RATE_LIMIT_WINDOW = "60"
```

## For Production Deployment

To deploy to production:

```bash
npx wrangler deploy --env production
```

This will use the `[env.production]` configuration.

## Troubleshooting

### Error: "KV namespace not found"
- Make sure you've created all 5 namespaces in Cloudflare dashboard
- Verify the namespace IDs are correct (no typos)
- Ensure you're logged into the correct Cloudflare account

### Error: "Authentication required"
- Run `npx wrangler login` to authenticate
- Or set environment variable: `CLOUDFLARE_API_TOKEN=your_token`

### Error: "Preview ID not found"
- Preview IDs are optional for `wrangler dev`
- You can skip them if you only need production deployment
- Or create them in Cloudflare dashboard under namespace settings

## Quick Reference

**Namespace Bindings:**
- TEMPLATES → `id` and `preview_id`
- SNIPPETS → `id` and `preview_id`
- REPORTS → `id` and `preview_id`
- SESSIONS → `id` and `preview_id`
- USAGE → `id` and `preview_id`

**Commands:**
```bash
# Authenticate
npx wrangler login

# Deploy to development
npx wrangler deploy

# Deploy to production
npx wrangler deploy --env production

# Local development
npx wrangler dev
```

## Next Steps

1. Create the 5 KV namespaces in Cloudflare dashboard
2. Copy all 10 IDs (5 namespace IDs + 5 preview IDs)
3. Update `wrangler.toml` with real IDs
4. Run `npx wrangler login`
5. Run `npx wrangler deploy`
6. Visit your deployed URL

Your worker will be available at: `https://radreport-ai-prod.YOUR_SUBDOMAIN.workers.dev`