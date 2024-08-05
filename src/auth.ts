import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import dotenv from 'dotenv';
import {getPlatformProxy} from 'wrangler';
import { saveUserToDatabase } from '$lib/db';

// Load environment variables from .env file during development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
    const dev = process.env.NODE_ENV !== 'production';
    const authOptions = {
        providers: [
            GitHub({
                clientId: dev ? process.env.GITHUB_ID : event.platform?.env?.GITHUB_ID,
                clientSecret: dev ? process.env.GITHUB_SECRET : event.platform?.env?.GITHUB_SECRET
            })
        ],
        secret: dev ? process.env.AUTH_SECRET : event.platform?.env?.AUTH_SECRET,
        trustHost: true,
        callbacks: {
            async signIn(data) {
                const { env } = await getPlatformProxy();
                const environment = dev ? env : event.platform?.env;
                await saveUserToDatabase(environment, data.user);
                return true;
            },
            async session({ session }) {
                const { user } = session;
                if (session?.user) {
                    session.user.id = user.id;
                }
                return session;
            }
        }
    };
    return authOptions;
});
