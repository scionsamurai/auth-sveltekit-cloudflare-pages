import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from '@auth/sveltekit/providers/github';
import { D1Adapter } from "@auth/d1-adapter";
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {

    const getEnv = (key) => {
        if (event.platform?.env.CF_PAGES === 'true') {
            return event.platform?.env[key];
        } else {
            switch(key) {
                case 'GITHUB_ID': return GITHUB_ID;
                case 'GITHUB_SECRET': return GITHUB_SECRET;
                case 'AUTH_SECRET': return AUTH_SECRET;
                default: return undefined;
            }
        }
    };

    const authOptions = {
        providers: [
            GitHub({
                clientId: getEnv('GITHUB_ID'),
                clientSecret: getEnv('GITHUB_SECRET')
            })
        ],
        secret: getEnv('AUTH_SECRET'),
        trustHost: true,
        adapter: D1Adapter(event.platform?.env.DB),
        session: {
            strategy: 'database',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            updateAge: 24 * 60 * 60 // update session age every 24 hours
        },
        callbacks: {
            async session({ session, token }) {
                // Include the user ID (sub) in the session
                if (token?.sub) {
                    session.user.id = token.sub;    
                }

                // Check for Cloudflare Pages environment
                session.dev = event.platform?.env.CF_PAGES;
                
                return session;
            }
        }
    };

    return authOptions;
});