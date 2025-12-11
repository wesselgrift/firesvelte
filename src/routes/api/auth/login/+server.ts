// SvelteKit utilities and Firebase admin SDK
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';

// Handles POST requests for user authentication and session creation
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Extract authentication token and optional user profile data from request body
		const { idToken, firstName, lastName } = await request.json();

		if (!idToken) {
			return json({ error: 'ID token is required' }, { status: 400 });
		}

		// Verify the Firebase ID token and extract user ID
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// Create a session cookie valid for 5 days (in milliseconds)
		const expiresIn = 60 * 60 * 24 * 5 * 1000; 
		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

		// Set secure HTTP-only session cookie
		cookies.set('session', sessionCookie, {
			path: '/',
			maxAge: expiresIn / 1000, 
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		// Retrieve existing user document from Firestore
		const userRef = adminDb.collection('users').doc(uid);
		const userDoc = await userRef.get();

		// Determine firstName and lastName: use provided values, fallback to existing data, then token name
		const existingData = userDoc.exists ? userDoc.data() : null;
		const firstNameValue = firstName !== undefined 
			? ((firstName && firstName.trim()) || decodedToken.name?.split(' ')[0] || null)
			: (existingData?.firstName || decodedToken.name?.split(' ')[0] || null);
		const lastNameValue = lastName !== undefined
			? ((lastName && lastName.trim()) || decodedToken.name?.split(' ').slice(1).join(' ') || null)
			: (existingData?.lastName || decodedToken.name?.split(' ').slice(1).join(' ') || null);

		// Prepare user data object with profile information
		const userData = {
			uid,
			email: decodedToken.email || null,
			firstName: firstNameValue,
			lastName: lastNameValue,
			emailVerified: decodedToken.email_verified || false,
			updatedAt: new Date()
		};

		// Create new user document or update existing one
		if (!userDoc.exists) {
			await userRef.set({
				...userData,
				createdAt: new Date()
			});
		} else {
			await userRef.update(userData);
		}

		return json({ success: true });
	} catch (error: any) {
		// Handle authentication errors and return appropriate error response
		console.error('Login error:', error);
		return json({ error: error.message || 'Authentication failed' }, { status: 401 });
	}
};