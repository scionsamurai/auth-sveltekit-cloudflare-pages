// auth.ts

import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from '@auth/sveltekit/providers/github';
import Google from "@auth/sveltekit/providers/google";
import { D1Adapter } from "@auth/d1-adapter";
import { GITHUB_ID, GITHUB_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import type { SvelteKitAuthConfig } from "@auth/sveltekit"; // Import the type// Import the D1Database type

/* interface Env {
    DB: D1Database;
    GITHUB_ID?: string;
    GITHUB_SECRET?: string;
    AUTH_SECRET?: string;
    AUTH_GOOGLE_ID?: string;
    AUTH_GOOGLE_SECRET?: string;
    CF_PAGES?: string;
} */

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
    // const env = event.platform?.env as Env | undefined;

    const getEnv = (key: 'GITHUB_ID' | 'GITHUB_SECRET' | 'AUTH_SECRET'  | 'AUTH_GOOGLE_ID' | 'AUTH_GOOGLE_SECRET'
    ): string => {
        let value: string | undefined;
        if (event.platform?.env?.CF_PAGES === 'true') {
            value = event.platform?.env[key];
        } else {
            value = key === 'GITHUB_ID' ? GITHUB_ID :
                    key === 'GITHUB_SECRET' ? GITHUB_SECRET :
                    key === 'AUTH_SECRET' ? AUTH_SECRET :
                    key === 'AUTH_GOOGLE_ID' ? AUTH_GOOGLE_ID :
                    key === 'AUTH_GOOGLE_SECRET' ? AUTH_GOOGLE_SECRET :
                    undefined;
        }

        if (!value) {
            throw new Error(`Environment variable ${key} is not set.`);
        }

        return value;
    };

    const authOptions: SvelteKitAuthConfig = { // Explicitly type the object
        providers: [
            GitHub({
                clientId: getEnv('GITHUB_ID'),
                clientSecret: getEnv('GITHUB_SECRET')
            }),
            Google({
                clientId: getEnv('AUTH_GOOGLE_ID'),
                clientSecret: getEnv('AUTH_GOOGLE_SECRET')
            })
        ],
        secret: getEnv('AUTH_SECRET'),
        trustHost: true,
        adapter: D1Adapter(event.platform?.env.DB),
        session: {
            strategy: 'database', // Now correctly typed as 'database'
            maxAge: 30 * 24 * 60 * 60, // 30 days
            updateAge: 24 * 60 * 60 // update session age every 24 hours
        },
        callbacks: {
            async session({ session, token }) {
                // Include the user ID (sub) in the session
                if (token?.sub) {
                    session.user = {
                        ...session.user,
                        id: token.sub
                    };
                }
                return session;
            }
        }
    };

    return authOptions;
});
