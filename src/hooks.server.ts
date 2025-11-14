import { adminAuth } from '$lib/server/firebase-admin';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

const publicRoutes = ['/', '/login', '/account', '/reset-password'];

export const handle: Handle = async ({ event, resolve }) => {
	// Skip auth for API routes
	if (event.url.pathname.startsWith('/api')) {
		return resolve(event);
	}

	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		try {
			const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
			event.locals.user = decodedClaims;

			// If user is verified and on a public route, redirect to app
			if (decodedClaims.email_verified && publicRoutes.includes(event.url.pathname)) {
				throw redirect(302, '/app');
			}

			// If user is not verified and not on verify-email page, redirect to verify-email
			if (!decodedClaims.email_verified && event.url.pathname !== '/verify-email') {
				throw redirect(302, '/verify-email');
			}
		} catch (error) {
			// Invalid session cookie
			event.locals.user = null;
			event.cookies.delete('session', { path: '/' });

			// If on protected route, redirect to login
			if (!publicRoutes.includes(event.url.pathname)) {
				throw redirect(302, '/login');
			}
		}
	} else {
		event.locals.user = null;

		// If on protected route, redirect to login
		if (!publicRoutes.includes(event.url.pathname)) {
			throw redirect(302, '/login');
		}
	}

	return resolve(event);
};

