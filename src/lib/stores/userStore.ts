import { writable } from 'svelte/store';

/**
 * Represents a user profile with authentication and personal information.
 * Used throughout the application to type-check user data.
 */
export interface UserProfile {
	// Required authentication fields
	uid: string;
	email: string | null;
	emailVerified: boolean;

	// Optional personal information
	firstName?: string;
	lastName?: string;

	// Optional metadata
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Global store indicating whether user authentication state is being loaded.
 * Starts as `true` and should be set to `false` once auth state is determined.
 */
export const loading = writable<boolean>(true);

/**
 * Global store containing the current user's profile data.
 * `null` when no user is authenticated, otherwise contains the UserProfile object.
 */
export const userProfile = writable<UserProfile | null>(null);