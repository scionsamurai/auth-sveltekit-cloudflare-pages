// src/app.d.ts

/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				GITHUB_ID?: string;       // Add GitHub Client ID
				GITHUB_SECRET?: string;   // Add GitHub Client Secret
				AUTH_SECRET?: string;     // Add Auth Secret
				CF_PAGES?: string;
				AUTH_GOOGLE_ID: string;
				AUTH_GOOGLE_SECRET: string;        // Add CF_PAGES flag
				// Add other environment variables as needed
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};

