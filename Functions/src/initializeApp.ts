/**
 * The Firebase Admin Node.js SDK enables access to Firebase services from
 * privileged environments (such as servers or cloud) in Node.js.
 */
import {
  initializeApp as _initializeApp,
  getApps,
  getApp,
} from 'firebase-admin/app';

/**
 * Creates and initializes a Firebase app instance.
 */
export const initializeApp = () => {
  if (getApps().length === 0) {
    _initializeApp();
  } else {
    getApp();
  }
};