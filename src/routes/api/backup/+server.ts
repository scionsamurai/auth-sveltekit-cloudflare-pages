// src/routes/api/backup/+server.ts
import { json } from '@sveltejs/kit';
import { TOTP_SECRET } from '$env/static/private';
import { TOTP } from '$lib/TOTP';

export async function POST({ request, platform, locals }) {
	const session = await locals.getSession();
	const isCloudflarePages = session?.dev === 'true';

	// Use the appropriate way to access the secret based on the environment
	const secret = isCloudflarePages ? platform.env.TOTP_SECRET : TOTP_SECRET;

	if (!platform) {
		return json({ error: 'Not running on Cloudflare Pages' }, { status: 400 });
	}

	const authHeader = request.headers.get('authorization');
	if (!authHeader) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const token = authHeader.split(' ')[1];

	const totp = new TOTP(secret);
	const isValid = await totp.verify(token);

	if (!isValid) {
		return json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
	}

	try {
		await backupDatabase(platform.env);
		return json({ success: true });
	} catch (error) {
		console.error('Backup failed:', error);
		return json({ error: 'Backup failed' }, { status: 500 });
	}
}
async function backupDatabase(env) {
	const tables = ['accounts', 'sessions', 'users', 'verification_tokens'];

	let backupContent = '';

	for (const table of tables) {
		try {
			const schemaResult = await env.DB.prepare(
				`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`
			)
				.bind(table)
				.all();
			if (schemaResult.results.length > 0) {
				const createTableStatement = schemaResult.results[0].sql;
				backupContent += `DROP TABLE IF EXISTS ${table};\n`;
				backupContent += `${createTableStatement};\n\n`;
			}

			const data = await env.DB.prepare(`SELECT * FROM ${table}`).all();
			if (data.results.length > 0) {
				backupContent += convertToSQLInsertStatements(table, data.results);
				backupContent += '\n';
			}
		} catch (error) {
			console.error(`Error backing up table ${table}:`, error);
			throw error;
		}
	}

	const filename = `full_backup_${new Date().toISOString()}.sql`;
	await storeInR2(env, filename, backupContent);
}

async function storeInR2(env, filename, content) {
	try {
		await env.MY_BUCKET.put(filename, content);
		console.log(`Backup stored successfully: ${filename}`);
	} catch (error) {
		console.error(`Error storing file ${filename} in R2:`, error);
		throw error;
	}
}
function convertToSQLInsertStatements(tableName, data) {
	let sqlStatements = '';
	for (const row of data) {
		const columns = Object.keys(row).join(', ');
		const values = Object.values(row)
			.map((val) => (val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`))
			.join(', ');
		sqlStatements += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
	}
	return sqlStatements;
}

export async function GET({ request, platform, locals }) {
	// Add authentication here similar to the POST handler

	const backups = await listBackups(platform.env);
	return json({ backups });
}

async function listBackups(env) {
	const list = await env.MY_BUCKET.list();
	return list.objects.map((obj) => obj.key);
}
