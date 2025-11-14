import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken, firstName, lastName } = await request.json();

		if (!idToken) {
			return json({ error: 'ID token is required' }, { status: 400 });
		}

		// Verify the ID token
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// Create session cookie (5-day expiry)
		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

		// Set the session cookie
		cookies.set('session', sessionCookie, {
			path: '/',
			maxAge: expiresIn / 1000, // Convert to seconds
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		// Upsert user profile in Firestore
		const userRef = adminDb.collection('users').doc(uid);
		const userDoc = await userRef.get();

		// Determine firstName and lastName values
		// For new users: use provided values, or token name, or null
		// For existing users: only update if provided, otherwise preserve existing
		const existingData = userDoc.exists ? userDoc.data() : null;
		const firstNameValue = firstName !== undefined 
			? ((firstName && firstName.trim()) || decodedToken.name?.split(' ')[0] || null)
			: (existingData?.firstName || decodedToken.name?.split(' ')[0] || null);
		const lastNameValue = lastName !== undefined
			? ((lastName && lastName.trim()) || decodedToken.name?.split(' ').slice(1).join(' ') || null)
			: (existingData?.lastName || decodedToken.name?.split(' ').slice(1).join(' ') || null);

		const userData = {
			uid,
			email: decodedToken.email || null,
			firstName: firstNameValue,
			lastName: lastNameValue,
			emailVerified: decodedToken.email_verified || false,
			updatedAt: new Date()
		};

		if (!userDoc.exists) {
			// Create new user profile
			await userRef.set({
				...userData,
				createdAt: new Date()
			});
		} else {
			// Update existing user profile
			await userRef.update(userData);
		}

		return json({ success: true });
	} catch (error: any) {
		console.error('Login error:', error);
		return json({ error: error.message || 'Authentication failed' }, { status: 401 });
	}
};

