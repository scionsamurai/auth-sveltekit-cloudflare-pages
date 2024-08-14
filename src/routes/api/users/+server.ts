import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, platform }) => {
    const session = await locals.auth();
    
    if (!session?.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const result = await platform.env.DB.prepare('SELECT * FROM users LIMIT 100').run();
        return json(result);
    } catch (err) {
        console.error('Database query error:', err);
        throw error(500, 'Internal Server Error');
    }
};