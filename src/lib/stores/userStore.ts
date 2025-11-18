// Svelte store imports
import { writable } from 'svelte/store';

// User profile type definition for authentication and personal data
export interface UserProfile {
	uid: string;
	email: string | null;
	emailVerified: boolean;
	firstName?: string;
	lastName?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// Tracks whether user authentication state is currently being loaded
export const loading = writable<boolean>(true);

// Global store containing the current user's profile data, or null if not authenticated
export const userProfile = writable<UserProfile | null>(null);