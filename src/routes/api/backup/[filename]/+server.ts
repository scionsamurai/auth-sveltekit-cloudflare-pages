// src/routes/api/backup/[filename]/+server.ts
import { json } from '@sveltejs/kit';

export async function GET({ params, platform, locals }) {
    // Add authentication here
  
    const { filename } = params;
    const fileContent = await retrieveFromR2(platform.env, filename);
  
    if (!fileContent) {
      return json({ error: 'Backup file not found' }, { status: 404 });
    }
  
    return json({ content: fileContent });
  }

  async function retrieveFromR2(env, filename) {
      try {
          const object = await env.MY_BUCKET.get(filename);
          if (object === null) {
              console.log(`File ${filename} not found in R2`);
              return null;
          }
          return await object.text();
      } catch (error) {
          console.error(`Error retrieving file ${filename} from R2:`, error);
          throw error;
      }
  }