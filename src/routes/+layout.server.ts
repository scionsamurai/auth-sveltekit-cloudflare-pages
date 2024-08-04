import type { LayoutServerLoad } from './$types';

 export const load: LayoutServerLoad = async (event) => {
     const dev = process.env.NODE_ENV !== 'production';
     return {
         session: await event.locals.auth(),
         authProviders: {
             github: {
                 clientId: dev ? process.env.GITHUB_ID : event.platform?.env?.GITHUB_ID
             }
         }
     };
 };