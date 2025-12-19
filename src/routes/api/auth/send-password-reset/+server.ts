// SvelteKit utilities and Firebase admin SDK
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';
import { sendPasswordResetEmail } from '$lib/server/loops';
import { env } from '$env/dynamic/private';

// Handles POST requests to send password reset email via Loops
export const POST: RequestHandler = async ({ request, url }) => {
	// Use APP_URL from env if set, otherwise auto-detect from request
	const baseUrl = env.APP_URL || `${url.protocol}//${url.host}`;
	const actionCodeSettings = {
		url: `${baseUrl}/auth-action`,
		handleCodeInApp: true
	};
	try {
		const { email } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Try to get user info for personalized email
		let firstName = 'there';
		try {
			const userRecord = await adminAuth.getUserByEmail(email);
			const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
			if (userDoc.exists) {
				firstName = userDoc.data()?.firstName || 'there';
			}
		} catch (err: any) {
			// If user doesn't exist, we still want to return success
			// to prevent email enumeration attacks
			if (err.code === 'auth/user-not-found') {
				// Return success even though user doesn't exist (security best practice)
				return json({ success: true });
			}
			console.error('Error fetching user data:', err);
		}

		// Generate password reset link using Firebase Admin SDK
		const resetLink = await adminAuth.generatePasswordResetLink(
			email,
			actionCodeSettings
		);

		// Send password reset email via Loops
		const result = await sendPasswordResetEmail(email, firstName, resetLink, baseUrl);

		if (!result.success) {
			// Still return success to prevent email enumeration
			console.error('Failed to send password reset email:', result.error);
		}

		return json({ success: true });
	} catch (error: any) {
		console.error('Send password reset error:', error);
		
		// Handle user not found - return success to prevent email enumeration
		if (error.code === 'auth/user-not-found') {
			return json({ success: true });
		}
		
		return json({ error: error.message || 'Failed to send password reset email' }, { status: 500 });
	}
};

