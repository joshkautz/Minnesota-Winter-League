import { initializeApp } from './initializeApp'

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Change, logger, region } from 'firebase-functions'

/**
 * The Firebase Admin Node.js SDK enables access to Firebase services from
 * privileged environments (such as servers or cloud) in Node.js.
 */

import {
	DocumentReference,
	FieldValue,
	getFirestore,
} from 'firebase-admin/firestore'
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore'

const REGIONS = {
	CENTRAL: 'us-central1',
}

const COLLECTIONS = {
	PLAYERS: 'players',
}

initializeApp()

/**
 * Firebase Authentication - Create the new `Players` Firestore Documents for the player.
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
			return Promise.all([
				playerDocumentReference.create({
					captain: false,
					firstname: '',
					lastname: '',
					email: user.email,
					registered: false,
					team: null,
				}),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Authentication - Delete the `Players` Firestore Document for the player.
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
			return Promise.all([firestore.recursiveDelete(playerDocumentReference)])
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Firestore - Add the player to the team. Add the team to the player. Delete all the `Offers` Firestore Documents for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const acceptOffer = region(REGIONS.CENTRAL)
	.firestore.document('offers/{offerId}')
	.onUpdate(async (change) => {
		try {
			const newValue = change.after.data()
			const previousValue = change.before.data()

			if (
				newValue.status === 'accepted' &&
				previousValue.status === 'pending'
			) {
				// Add the team to the player.
				await (newValue.player as DocumentReference).update({
					team: newValue.team,
				})

				// Add the player to the team.
				await (newValue.team as DocumentReference).update({
					roster: FieldValue.arrayUnion(newValue.player),
				})

				// Delete all the `Offers` Firestore Documents for the player.
				const firestore = getFirestore()
				const offers = await firestore
					.collection('offers')
					.where('player', '==', newValue.player)
					.get()

				return Promise.all(offers.docs.map((offer) => offer.ref.delete()))
			}

			return
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Firestore - Delete the rejected `Offers` Firestore Document for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const rejectOffer = region(REGIONS.CENTRAL)
	.firestore.document('offers/{offerId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data()
			const previousValue = change.before.data()

			if (
				newValue.status === 'rejected' &&
				previousValue.status === 'pending'
			) {
				// Delete the rejected `Offers` Firestore Document for the player.
				return Promise.all([change.after.ref.delete()])
			}

			return
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Firestore - Update the `Players` Firestore Document for the player when they create a new `Team` Firestore Document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_new_document_is_created_2 Trigger a function when a document is created.}
 */

export const updatePlayer = region(REGIONS.CENTRAL)
	.firestore.document('teams/{teamId}')
	.onCreate(async (snapshot: QueryDocumentSnapshot) => {
		try {
			const teamRef = snapshot.ref
			const playerRef = snapshot.data().captains.pop() as DocumentReference

			return Promise.all([
				playerRef.update({
					captain: true,
					team: teamRef,
				}),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})
