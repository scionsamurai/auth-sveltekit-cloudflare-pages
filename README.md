# SvelteKit with Cloudflare Pages, D1 Storage, and OAuth Example

This repository contains the example code for the blog post titled **["Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth."](https://www.jimscode.blog/posts/cloudflare-d1-oauth)** It demonstrates how to create a SvelteKit application integrated with Cloudflare's D1 database and GitHub OAuth authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Usage](#usage)

## Features

- **SvelteKit Framework**: A modern framework for building web applications.
- **Cloudflare Pages**: Fast and secure deployment of static sites and serverless functions.
- **D1 Storage**: A lightweight SQL database solution by Cloudflare.
- **OAuth Authentication**: Secure user authentication using GitHub.
  
**Note:** It is highly recommended to follow the blog post directly for the most up-to-date instructions and context. This repository serves as a reference for the blog posts. If you prefer to start from where the blog posts leave off, the following instructions may help.

## Prerequisites

Before using this code, ensure you have the following:

- A Cloudflare account
- A GitHub account (for OAuth setup)
- Node.js and npm installed on your machine
- Wrangler CLI installed for managing Cloudflare Workers

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/scionsamurai/auth-sveltekit-cloudflare-pages.git
   cd auth-sveltekit-cloudflare-pages
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
   ```

2. Update the `wrangler.toml` file with your Cloudflare account details and D1 database information:
   ```toml
   [vars]
   AUTH_SECRET = "github_auth_secret"
   AUTH_TRUST_HOST = "true"
   GITHUB_ID = "github_id_generated_for_oauth"
   GITHUB_SECRET = "secret_generated_with_id"

   [[d1_databases]]
   binding = "DB" # i.e. available in your Worker on env.DB
   database_name = "my_sveltekit_db"
   database_id = "<your-database-id>"
   ```

3. Log in to Wrangler:
   ```bash
   npx wrangler login
   ```

## Database Setup

1. Create a file named `update_users_schema.sql` with the following content:

   ```sql
   DROP TABLE IF EXISTS accounts;
   DROP TABLE IF EXISTS "sessions";
   DROP TABLE IF EXISTS users;
   DROP TABLE IF EXISTS verification_tokens;

   CREATE TABLE IF NOT EXISTS "accounts" (
     "id" TEXT NOT NULL,
     "userId" TEXT NOT NULL DEFAULT NULL,
     "type" TEXT NOT NULL DEFAULT NULL,
     "provider" TEXT NOT NULL DEFAULT NULL,
     "providerAccountId" TEXT NOT NULL DEFAULT NULL,
     "refresh_token" TEXT DEFAULT NULL,
     "access_token" TEXT DEFAULT NULL,
     "expires_at" INTEGER DEFAULT NULL,
     "token_type" TEXT DEFAULT NULL,
     "scope" TEXT DEFAULT NULL,
     "id_token" TEXT DEFAULT NULL,
     "session_state" TEXT DEFAULT NULL,
     "oauth_token_secret" TEXT DEFAULT NULL,
     "oauth_token" TEXT DEFAULT NULL,
     PRIMARY KEY (id)
   );

   CREATE TABLE IF NOT EXISTS "sessions" (
     "id" TEXT NOT NULL,
     "sessionToken" TEXT NOT NULL,
     "userId" TEXT NOT NULL DEFAULT NULL,
     "expires" DATETIME NOT NULL DEFAULT NULL, 
     PRIMARY KEY (sessionToken)
   );

   CREATE TABLE IF NOT EXISTS "users" (
     "id" TEXT NOT NULL DEFAULT '',
     "name" TEXT DEFAULT NULL,
     "email" TEXT DEFAULT NULL,
     "emailVerified" DATETIME DEFAULT NULL,
     "image" TEXT DEFAULT NULL, 
     PRIMARY KEY (id)
   );

   CREATE TABLE IF NOT EXISTS "verification_tokens" (
     "identifier" TEXT NOT NULL,
     "token" TEXT NOT NULL DEFAULT NULL,
     "expires" DATETIME NOT NULL DEFAULT NULL, 
     PRIMARY KEY (token)
   );
   ```

2. Execute the SQL file to set up the database schema:
   ```bash
   npx wrangler d1 execute my_sveltekit_db --file update_users_schema.sql
   ```

   Note: Add the `--remote` flag if you want to execute this on the remote database.

## Local Development

To run the application locally, use the following command:

```bash
npm run dev:full
```

This command builds the project and starts the Wrangler Pages development server. Access the application at `http://localhost:5173` in your web browser.

## Deployment

1. Connect your local repository to your GitHub repository:
   ```bash
   git remote add origin <your-github-repo-url>
   ```

2. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. Set up Cloudflare Pages:
   - Log in to your Cloudflare account and navigate to the Pages section.
   - Click "Create a project" and select your GitHub repository.
   - Configure your build settings:
     - Build command: `npm run build`
     - Build output directory: `.svelte-kit/cloudflare`
   - Add your environment variables in the Cloudflare Pages settings.
   - Deploy your site.

## Usage

After deploying, your application will be available at the Cloudflare Pages URL provided. You can now use the application with GitHub OAuth authentication and D1 database storage.

For local development, access the application at `http://localhost:5173`.

---

For more detailed information on the implementation and concepts, please refer to the accompanying blog post: [Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth](https://www.jimscode.blog/posts/cloudflare-d1-oauth)

If you encounter any issues or have questions, please open an issue in this repository.
