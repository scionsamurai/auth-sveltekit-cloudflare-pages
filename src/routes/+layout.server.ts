// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { dev } from '$app/environment';
import { GITHUB_ID, AUTH_GOOGLE_ID } from '$env/static/private';

export const load: LayoutServerLoad = async (event) => {
    return {
        session: await event.locals.auth(),
        authProviders: {
            github: {
                clientId: dev ? GITHUB_ID : event.platform?.env?.GITHUB_ID
            },
            google: {
                clientId: dev ? AUTH_GOOGLE_ID : event.platform?.env?.AUTH_GOOGLE_ID
            }
        }
    };
};