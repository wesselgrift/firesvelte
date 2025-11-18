// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Type imports for Firebase authentication and user profile data
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { UserProfile } from '$lib/stores/userStore';

// Global type definitions for SvelteKit App namespace
declare global {
	namespace App {
		// Error object shape for error pages
		interface Error {
			status?: number;
			message?: string;
		}
		// Server-side locals available in load functions and API routes
		interface Locals {
			user: DecodedIdToken | null;
		}
		// Page data shape available to all pages
		interface PageData {
			user?: DecodedIdToken | null;
			userProfile?: UserProfile | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// Required to make this file a module
export {};
