// Firebase admin database and type imports
import { adminDb } from '$lib/server/firebase-admin';
import type { UserProfile } from '$lib/stores/userStore.svelte';
import type { LayoutServerLoad } from './$types';

// Server-side load function that fetches user profile data for authenticated users
export const load: LayoutServerLoad = async ({ locals }) => {
	// Return null values if user is not authenticated
	if (!locals.user) {
		return {
			user: null,
			userProfile: null
		};
	}

	try {
		// Fetch user document from Firestore
		const userDoc = await adminDb.collection('users').doc(locals.user.uid).get();

		let userProfile: UserProfile | null = null;

		// Build user profile from Firestore data or fallback to auth user data
		if (userDoc.exists) {
			const data = userDoc.data();
			userProfile = {
				uid: data?.uid || locals.user.uid,
				email: data?.email || locals.user.email || null,
				firstName: data?.firstName || null,
				lastName: data?.lastName || null,
				emailVerified: data?.emailVerified || locals.user.email_verified || false,
				createdAt: data?.createdAt?.toDate() || undefined,
				updatedAt: data?.updatedAt?.toDate() || undefined
			};
		} else {
			// Create profile from auth user data if Firestore document doesn't exist
			userProfile = {
				uid: locals.user.uid,
				email: locals.user.email || null,
				firstName: locals.user.name?.split(' ')[0] || undefined,
				lastName: locals.user.name?.split(' ').slice(1).join(' ') || undefined,
				emailVerified: locals.user.email_verified || false
			};
		}

		return {
			user: locals.user,
			userProfile
		};
	} catch (error) {
		// Return user without profile if database query fails
		console.error('Error loading user profile:', error);
		return {
			user: locals.user,
			userProfile: null
		};
	}
};

