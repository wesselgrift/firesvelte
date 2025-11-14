import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Delete the session cookie
		cookies.delete('session', { path: '/' });

		return json({ success: true });
	} catch (error: any) {
		console.error('Logout error:', error);
		return json({ error: error.message || 'Logout failed' }, { status: 500 });
	}
};

