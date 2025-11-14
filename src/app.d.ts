// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { UserProfile } from '$lib/stores/userStore';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: DecodedIdToken | null;
		}
		interface PageData {
			user?: DecodedIdToken | null;
			userProfile?: UserProfile | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
