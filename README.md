
# SvelteKit with Cloudflare Pages, D1 Storage, and OAuth Example

This repository contains the example code for the blog post titled **["Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth."](https://www.jimscode.blog/posts/cloudflare-d1-oauth)** It demonstrates how to create a SvelteKit application integrated with Cloudflare's D1 database and GitHub OAuth authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
## Features

- **SvelteKit Framework**: A modern framework for building web applications.
- **Cloudflare Pages**: Fast and secure deployment of static sites and serverless functions.
- **D1 Storage**: A lightweight SQL database solution by Cloudflare.
- **OAuth Authentication**: Secure user authentication using GitHub.

## Prerequisites

Before using this code, ensure you have the following:

- A Cloudflare account
- A GitHub account (for OAuth setup)
- Node.js and npm installed on your machine
- Wrangler CLI installed for managing Cloudflare Workers

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/my-sveltekit-app.git
   cd my-sveltekit-app
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
   DATABASE_URL=your_database_url
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   AUTH_SECRET=your_auth_secret
   ```

4. Update the `wrangler.toml` file with your Cloudflare account details and D1 database information:
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
5. Ensure local D1 and/or remote have expected tables. For remote you would need to add "--remote" flag to the below command. In your terminal, run:

   ```
   npx wrangler d1 execute my_db --command "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, image TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"

   ```

## Usage

To run the application locally, use the following command:

```bash
npm run dev
```

Access the application at `http://localhost:5173` in your web browser.


---

Feel free to customize any sections to better fit your project's specifics or personal preferences!