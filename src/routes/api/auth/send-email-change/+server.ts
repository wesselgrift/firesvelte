// SvelteKit utilities and Firebase admin SDK
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';
import { sendEmailChangeVerificationEmail } from '$lib/server/loops';

// Handles POST requests to send email change verification via Loops
export const POST: RequestHandler = async ({ request, cookies, url }) => {
	// Build action code settings dynamically based on request origin
	const baseUrl = `${url.protocol}//${url.host}`;
	const actionCodeSettings = {
		url: `${baseUrl}/auth-action`,
		handleCodeInApp: true
	};
	try {
		const { currentEmail, newEmail } = await request.json();

		if (!currentEmail || !newEmail) {
			return json({ error: 'Current email and new email are required' }, { status: 400 });
		}

		// Verify the user is authenticated via session cookie
		const sessionCookie = cookies.get('session');
		if (!sessionCookie) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Verify session and get user info
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
		
		// Ensure the current email matches the authenticated user
		if (decodedClaims.email !== currentEmail) {
			return json({ error: 'Email mismatch' }, { status: 403 });
		}

		// Get user's first name from Firestore for personalized email
		let firstName = 'there';
		try {
			const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
			if (userDoc.exists) {
				firstName = userDoc.data()?.firstName || 'there';
			}
		} catch (err) {
			console.error('Error fetching user data:', err);
		}

		// Generate email change verification link using Firebase Admin SDK
		// This link will verify the new email and update it when clicked
		const verificationLink = await adminAuth.generateVerifyAndChangeEmailLink(
			currentEmail,
			newEmail,
			actionCodeSettings
		);

		// Send verification email to the NEW email address via Loops
		const result = await sendEmailChangeVerificationEmail(
			newEmail,
			firstName,
			verificationLink,
			newEmail,
			baseUrl
		);

		if (!result.success) {
			return json({ error: result.error || 'Failed to send email change verification' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error: any) {
		console.error('Send email change verification error:', error);
		
		// Handle specific Firebase errors
		if (error.code === 'auth/email-already-exists') {
			return json({ error: 'This email is already in use by another account' }, { status: 400 });
		}
		if (error.code === 'auth/invalid-email') {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}
		if (error.code === 'auth/session-cookie-expired') {
			return json({ error: 'Session expired' }, { status: 401 });
		}
		
		return json({ error: error.message || 'Failed to send email change verification' }, { status: 500 });
	}
};

