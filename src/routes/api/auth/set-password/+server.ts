// SvelteKit utilities and Firebase admin SDK
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth } from '$lib/server/firebase-admin';

// Handles POST requests for setting initial password (for Google-only users)
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Get session cookie
		const sessionCookie = cookies.get('session');
		if (!sessionCookie) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Verify the session cookie and extract user ID
		// Use false for checkRevoked since setting password shouldn't revoke the session
		const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, false);
		const uid = decodedToken.uid;

		// Get user record to check if password already exists
		const userRecord = await adminAuth.getUser(uid);
		const hasPasswordProvider = userRecord.providerData.some(
			(provider) => provider.providerId === 'password'
		);

		if (hasPasswordProvider) {
			return json(
				{ error: 'Password already set. Use update-password endpoint instead.' },
				{ status: 400 }
			);
		}

		// Extract new password from request body
		const { newPassword } = await request.json();

		if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
			return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
		}

		// Set password using Firebase Admin
		await adminAuth.updateUser(uid, {
			password: newPassword
		});

		return json({ success: true });
	} catch (error: any) {
		console.error('Set password error:', error);

		// Handle specific Firebase errors
		if (error.code === 'auth/weak-password') {
			return json({ error: 'Password is too weak' }, { status: 400 });
		}
		if (error.code === 'auth/argument-error' || error.message?.includes('expired')) {
			return json({ error: 'Session expired. Please refresh the page and try again.' }, { status: 401 });
		}
		if (error.code === 'auth/session-cookie-expired') {
			return json({ error: 'Session expired. Please refresh the page and try again.' }, { status: 401 });
		}

		return json({ error: error.message || 'Failed to set password' }, { status: 500 });
	}
};
