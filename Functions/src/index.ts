import { initializeApp } from './initializeApp'

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { logger, region } from 'firebase-functions'

/**
 * The Firebase Admin Node.js SDK enables access to Firebase services from
 * privileged environments (such as servers or cloud) in Node.js.
 */

import { getFirestore } from 'firebase-admin/firestore'

const REGIONS = {
	CENTRAL: 'us-central1',
}

const COLLECTIONS = {
	PLAYERS: 'players',
	CUSTOMERS: 'customers',
}

initializeApp()

/**
 * Firebase Authentication - Create `Player` and `Customer` Firestore Documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_creation Trigger a function on user creation.}
 */

export const createPlayer = region(REGIONS.CENTRAL)
	.auth.user()
	.onCreate((user) => {
		try {
			const firestore = getFirestore()
			const playerDocumentReference = firestore
				.collection(COLLECTIONS.PLAYERS)
				.doc(user.uid)
			const customerDocumentReference = firestore
				.collection(COLLECTIONS.CUSTOMERS)
				.doc(user.uid)
			return Promise.all([
				playerDocumentReference.create({
					captain: false,
					firstname: '',
					lastname: '',
					email: user.email,
					registered: false,
					team: null,
				}),
				customerDocumentReference.create({}),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Authentication - Delete `Player` and `Customer` Firestore Documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const deletePlayer = region(REGIONS.CENTRAL)
	.auth.user()
	.onDelete((user) => {
		try {
			const firestore = getFirestore()
			const playerDocumentReference = firestore
				.collection(COLLECTIONS.PLAYERS)
				.doc(user.uid)
			const customerDocumentReference = firestore
				.collection(COLLECTIONS.CUSTOMERS)
				.doc(user.uid)
			return Promise.all([
				firestore.recursiveDelete(playerDocumentReference),
				firestore.recursiveDelete(customerDocumentReference),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})
