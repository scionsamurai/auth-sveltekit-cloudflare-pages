import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const user = await request.json();
		const results = await saveUserToDatabase(platform?.env, user);
		return new Response(JSON.stringify(results), { status: 201 });
	} catch (error) {
		console.error('Error saving user:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};


async function saveUserToDatabase(env, user) {
	try {
		// Check if the user already exists by email
		const existingUser = await env.DB.prepare('SELECT name, image FROM users WHERE email = ?')
			.bind(user.email)
			.first();

		if (existingUser) {
			// User exists, update only if name or image has changed
			let updateNeeded = false;
			const updateFields = [];

			if (existingUser.name !== user.name) {
				updateFields.push('name = ?');
				updateFields.push(user.name);
				updateNeeded = true;
			}

			if (existingUser.image !== user.image) {
				updateFields.push('image = ?');
				updateFields.push(user.image);
				updateNeeded = true;
			}

			if (updateNeeded) {
				const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE email = ?`;
				const updateResult = await env.DB.prepare(updateQuery)
					.bind(...updateFields, user.email)
					.run();
				return { status: 'updated', results: updateResult };
			}

			return { status: 'no-change', results: null };
		} else {
			// User does not exist, insert a new record
			const insertResult = await env.DB.prepare(
				'INSERT INTO users (name, email, image) VALUES (?, ?, ?)'
			)
				.bind(user.name, user.email, user.image)
				.run();
			return { status: 'created', results: insertResult };
		}
	} catch (error) {
		console.error('Error saving user to database:', error);
		throw new Error('Database operation failed');
	}
}