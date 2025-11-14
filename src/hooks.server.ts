import { adminAuth } from '$lib/server/firebase-admin';
import { redirect, isRedirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Routes that don't require authentication to access
const publicRoutes = ['/', '/login', '/account', '/reset-password'];

/**
 * Server hook that runs on every request to handle authentication and route protection
 * This ensures users are authenticated before accessing protected routes
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Skip authentication checks for API routes - they handle their own auth
	if (event.url.pathname.startsWith('/api')) {
		console.log('[AUTH] Skipping auth check for API route:', event.url.pathname);
		return resolve(event);
	}

	console.log('[AUTH] Checking auth state for route:', event.url.pathname);

	// Get the session cookie from the request
	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		console.log('[AUTH] Session cookie found, verifying...');
		// User has a session cookie - verify it's valid
		try {
			// Verify the session cookie with Firebase Admin SDK
			// The second parameter (true) checks if the cookie was revoked
			const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
			
			console.log('[AUTH] Session cookie verified successfully:', {
				uid: decodedClaims.uid,
				email: decodedClaims.email,
				email_verified: decodedClaims.email_verified,
				auth_time: new Date(decodedClaims.auth_time * 1000).toISOString()
			});
			
			// Store user data in event.locals so it's available in load functions and pages
			event.locals.user = decodedClaims;

			// If user's email is verified and they're on a public route, redirect to app
			if (decodedClaims.email_verified && publicRoutes.includes(event.url.pathname)) {
				console.log('[AUTH] Email verified user on public route, redirecting to /app');
				throw redirect(302, '/app');
			}

			// If user's email is not verified and they're not on the verify-email page, redirect them
			if (!decodedClaims.email_verified && event.url.pathname !== '/verify-email') {
				console.log('[AUTH] Email not verified, redirecting to /verify-email');
				throw redirect(302, '/verify-email');
			}

			console.log('[AUTH] User authenticated, allowing access to:', event.url.pathname);
		} catch (error) {
			// If this is a redirect, re-throw it (redirects throw errors in SvelteKit)
			if (isRedirect(error)) {
				throw error;
			}

			// Session cookie is invalid, expired, or revoked
			console.log('[AUTH] Session cookie verification failed:', error instanceof Error ? error.message : 'Unknown error');
			
			// Clear the user data and delete the invalid cookie
			event.locals.user = null;
			event.cookies.delete('session', { path: '/' });
			console.log('[AUTH] Invalid session cookie deleted');

			// If user is trying to access a protected route, redirect to login
			if (!publicRoutes.includes(event.url.pathname)) {
				console.log('[AUTH] Protected route accessed without valid session, redirecting to /login');
				throw redirect(302, '/login');
			}
		}
	} else {
		// No session cookie found - user is not authenticated
		console.log('[AUTH] No session cookie found - user not authenticated');
		event.locals.user = null;

		// If user is trying to access a protected route, redirect to login
		if (!publicRoutes.includes(event.url.pathname)) {
			console.log('[AUTH] Protected route accessed without session, redirecting to /login');
			throw redirect(302, '/login');
		} else {
			console.log('[AUTH] Public route accessed, allowing access');
		}
	}

	// Continue processing the request
	return resolve(event);
};

