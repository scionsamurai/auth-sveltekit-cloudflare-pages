import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import dotenv from 'dotenv';

// Load environment variables from .env file during development
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

async function saveUser(event, user) {
	const response = await event.fetch('/api/save-user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	});
	if (!response.ok) {
		throw new Error('Failed to save user');
	}
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
			async signIn({ user }) {
				await saveUser(event, user);
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
