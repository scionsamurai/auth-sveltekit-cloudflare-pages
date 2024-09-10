# SvelteKit with Cloudflare Pages, D1 Storage, OAuth, and Automated Backups Example

This repository contains the example code for two blog posts:
1. **["Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth"](https://www.jimscode.blog/posts/cloudflare-d1-oauth)**
2. **["Implementing Secure Automated Backups for SvelteKit on Cloudflare"](https://www.jimscode.blog/posts/sveltekit-cloudflare-backups)**

It demonstrates how to create a SvelteKit application integrated with Cloudflare's D1 database, GitHub OAuth authentication, and an automated backup system.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Backup System Setup](#backup-system-setup)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Usage](#usage)

## Features

- **SvelteKit Framework**: A modern framework for building web applications.
- **Cloudflare Pages**: Fast and secure deployment of static sites and serverless functions.
- **D1 Storage**: A lightweight SQL database solution by Cloudflare.
- **OAuth Authentication**: Secure user authentication using GitHub.
- **Automated Backups**: Secure, scheduled backups of the D1 database to Cloudflare R2 storage.
- **TOTP Authentication**: Time-Based One-Time Password authentication for the backup API.

**Note:** It is highly recommended to follow the blog posts directly for the most up-to-date instructions and context. This repository serves as a reference for the blog posts. If you prefer to start from where the blog posts leave off, the following instructions may help.

## Prerequisites

Before using this code, ensure you have the following:

- A Cloudflare account
- A GitHub account (for OAuth setup)
- Node.js and npm installed on your machine
- Wrangler CLI installed for managing Cloudflare Workers

## Installation

1. Clone this repository:
   ```bash
   git clone --branch with-r2-backup https://github.com/scionsamurai/auth-sveltekit-cloudflare-pages.git
   cd auth-sveltekit-cloudflare-pages
   git checkout with-r2-backup
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   AUTH_SECRET=your_auth_secret
   AUTH_TRUST_HOST=true
   TOTP_SECRET=your_totp_secret
   ```

2. Update the `wrangler.toml` file with your Cloudflare account details, D1 database information, and R2 bucket:
   ```toml
   [vars]
   AUTH_SECRET = "github_auth_secret"
   AUTH_TRUST_HOST = "true"
   GITHUB_ID = "github_id_generated_for_oauth"
   GITHUB_SECRET = "secret_generated_with_id"
   TOTP_SECRET = "your_totp_secret"

   [[d1_databases]]
   binding = "DB" # i.e. available in your Worker on env.DB
   database_name = "my_sveltekit_db"
   database_id = "<your-database-id>"

   [[r2_buckets]]
   binding = "MY_BUCKET"
   bucket_name = "my-app-backups"
   ```

3. Log in to Wrangler:
   ```bash
   npx wrangler login
   ```

## Database Setup

[The database setup remains the same as in the original README]

## Backup System Setup

1. Create a new file `src/routes/api/backup/+server.ts` for the backup API endpoint.
2. Implement the TOTP authentication in `src/lib/TOTP.js`.
3. Create a GitHub Actions workflow file at `.github/workflows/backup.yml` for automated backups.

## Local Development

To run the application locally, use the following command:

```bash
npm run dev:full
```

This command builds the project and starts the Wrangler Pages development server. Access the application at `http://localhost:5173` in your web browser.

## Deployment

[The deployment process remains the same as in the original README]

## Usage

After deploying, your application will be available at the Cloudflare Pages URL provided. You can now use the application with GitHub OAuth authentication, D1 database storage, and automated backups to R2.

To test the backup system:

1. Generate a TOTP token:
   ```bash
   export TOTP_SECRET=your_totp_secret
   node genTotp.js
   ```

2. Trigger a backup:
   ```bash
   export TOKEN=$(node genTotp.js)
   curl -X POST https://your-app.pages.dev/api/backup \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"action": "backup"}'
   ```

For local development, access the application at `http://localhost:5173`.

---

For more detailed information on the implementation and concepts, please refer to the accompanying blog posts:
1. [Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth](https://www.jimscode.blog/posts/cloudflare-d1-oauth)
2. [Implementing Secure Automated Backups for SvelteKit on Cloudflare](https://your-blog-url-here)

If you encounter any issues or have questions, please open an issue in this repository.
