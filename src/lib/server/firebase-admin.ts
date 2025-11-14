import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import {
	FIREBASE_PROJECT_ID,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY
} from '$env/static/private';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

// Guard against duplicate initialization
if (getApps().length === 0) {
	adminApp = initializeApp({
		credential: cert({
			projectId: FIREBASE_PROJECT_ID,
			clientEmail: FIREBASE_CLIENT_EMAIL,
			privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
		})
	});
	adminAuth = getAuth(adminApp);
	adminDb = getFirestore(adminApp);
} else {
	adminApp = getApps()[0];
	adminAuth = getAuth(adminApp);
	adminDb = getFirestore(adminApp);
}

export { adminAuth, adminDb };
export type { Auth, Firestore };

