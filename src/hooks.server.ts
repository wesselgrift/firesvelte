// Firebase Admin SDK for verifying session cookies
import { adminAuth } from '$lib/server/firebase-admin';

// SvelteKit utilities for redirects and type definitions
import { redirect, isRedirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/account', '/reset-password'];

// Server hook that runs on every request to handle authentication and route protection
export const handle: Handle = async ({ event, resolve }) => {
	// Skip authentication checks for API routes
	if (event.url.pathname.startsWith('/api')) {
		console.log('[AUTH] Skipping auth check for API route:', event.url.pathname);
		return resolve(event);
	}

	console.log('[AUTH] Checking auth state for route:', event.url.pathname);

	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		console.log('[AUTH] Session cookie found, verifying...');
		try {
			// Verify the session cookie and decode user claims
			const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
			
			console.log('[AUTH] Session cookie verified successfully:', {
				uid: decodedClaims.uid,
				email: decodedClaims.email,
				email_verified: decodedClaims.email_verified,
				auth_time: new Date(decodedClaims.auth_time * 1000).toISOString()
			});
			
			// Attach user data to event locals for use in load functions and pages
			event.locals.user = decodedClaims;

			// Redirect verified users away from public routes to the app
			if (decodedClaims.email_verified && publicRoutes.includes(event.url.pathname)) {
				console.log('[AUTH] Email verified user on public route, redirecting to /app');
				throw redirect(302, '/app');
			}

			// Redirect unverified users to email verification page
			if (!decodedClaims.email_verified && event.url.pathname !== '/verify-email') {
				console.log('[AUTH] Email not verified, redirecting to /verify-email');
				throw redirect(302, '/verify-email');
			}

			console.log('[AUTH] User authenticated, allowing access to:', event.url.pathname);
		} catch (error) {
			// Re-throw redirect errors to allow SvelteKit to handle them
			if (isRedirect(error)) {
				throw error;
			}

			console.log('[AUTH] Session cookie verification failed:', error instanceof Error ? error.message : 'Unknown error');
			
			// Clear invalid session data
			event.locals.user = null;
			event.cookies.delete('session', { path: '/' });
			console.log('[AUTH] Invalid session cookie deleted');

			// Redirect to login if trying to access protected route with invalid session
			if (!publicRoutes.includes(event.url.pathname)) {
				console.log('[AUTH] Protected route accessed without valid session, redirecting to /login');
				throw redirect(302, '/login');
			}
		}
	} else {
		console.log('[AUTH] No session cookie found - user not authenticated');
		event.locals.user = null;

		// Redirect to login if accessing protected route without session
		if (!publicRoutes.includes(event.url.pathname)) {
			console.log('[AUTH] Protected route accessed without session, redirecting to /login');
			throw redirect(302, '/login');
		} else {
			console.log('[AUTH] Public route accessed, allowing access');
		}
	}

	return resolve(event);
};

