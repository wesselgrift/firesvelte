import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Handles logout by deleting the session cookie
export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Delete the session cookie from all paths
		cookies.delete('session', { path: '/' });

		return json({ success: true });
	} catch (error: any) {
		console.error('Logout error:', error);
		return json({ error: error.message || 'Logout failed' }, { status: 500 });
	}
};

