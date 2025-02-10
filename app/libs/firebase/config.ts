import admin, { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

import serviceAccount from './dek-d-ku-2737b-firebase-adminsdk-fbsvc-990c74472a.json';

if (!getApps().length) {
  console.log('Initializing Firebase app');
  initializeApp({
    credential: cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

export { bucket };
