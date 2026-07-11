/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Hardcoded config matching the generated firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyC8Qs1a6QvTL0wLSZbdVpTNVE5lOiPGu2c",
  authDomain: "topperzone-c52a3.firebaseapp.com",
  projectId: "topperzone-c52a3",
  storageBucket: "topperzone-c52a3.firebasestorage.app",
  messagingSenderId: "682230317850",
  appId: "1:682230317850:web:80dd389d28a1f6231722a3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-sumitkumarprofes-1f860c96-a184-471e-a2dc-78ab7dfcbb13");

import { enableIndexedDbPersistence, doc, getDocFromServer } from 'firebase/firestore';

// Enable offline persistence for seamless offline operation in restricted/sandboxed environments
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] Multiple tabs open, persistence can only be enabled in one tab.');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] The current browser does not support offline persistence.');
    } else {
      console.warn('[Firebase] Could not enable offline persistence:', err.message);
    }
  });

  // Validate connection to Firestore as required by firebase-integration skill
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log('[Firebase] Successfully reached Firestore backend.');
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('[Firebase] Please check your Firebase configuration: Client is offline.');
      } else {
        console.warn('[Firebase] Initial connection check warning:', error);
      }
    }
  };
  testConnection();
}

export const auth = getAuth(app);
