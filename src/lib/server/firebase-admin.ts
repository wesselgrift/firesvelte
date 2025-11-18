// Firebase Admin SDK imports
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Environment variables for Firebase Admin credentials
import {
	FIREBASE_PROJECT_ID,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY
} from '$env/static/private';

// Admin SDK service instances
let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

// Guard against duplicate initialization - reuse existing app if already initialized
if (getApps().length === 0) {
	adminApp = initializeApp({
		credential: cert({
			projectId: FIREBASE_PROJECT_ID,
			clientEmail: FIREBASE_CLIENT_EMAIL,
			privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
		})
	});
	adminAuth = getAuth(adminApp);
	adminDb = getFirestore(adminApp);
} else {
	// Reuse existing Firebase Admin app instance
	adminApp = getApps()[0];
	adminAuth = getAuth(adminApp);
	adminDb = getFirestore(adminApp);
}

export { adminAuth, adminDb };
export type { Auth, Firestore };

