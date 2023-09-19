import { initializeApp } from './initializeApp'

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
	Change,
	CloudFunction,
	EventContext,
	logger,
	region,
} from 'firebase-functions'

/**
 * The Firebase Admin Node.js SDK enables access to Firebase services from
 * privileged environments (such as servers or cloud) in Node.js.
 */

import {
	DocumentData,
	DocumentReference,
	FieldValue,
	getFirestore,
} from 'firebase-admin/firestore'
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore'
import { UserRecord } from 'firebase-functions/v1/auth'

const REGIONS = {
	CENTRAL: 'us-central1',
}

const COLLECTIONS = {
	PLAYERS: 'players',
}

initializeApp()

interface Player extends DocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference<Team> | null
}

interface Team extends DocumentData {
	captains: DocumentReference<Player>[]
	logo: string
	name: string
	registered: boolean
	roster: DocumentReference<Player>[]
}

interface Offer extends DocumentData {
	creator: string
	player: DocumentReference<Player>
	status: string
	team: DocumentReference<Team>
}

/**
 * Firebase Authentication - Delete the `Players` Firestore Document for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnUserDeleted: CloudFunction<UserRecord> = region(REGIONS.CENTRAL)
	.auth.user()
	.onDelete((user: UserRecord) => {
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

export const OnOfferAccepted: CloudFunction<Change<QueryDocumentSnapshot>> =
	region(REGIONS.CENTRAL)
		.firestore.document('offers/{offerId}')
		.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
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

					return Promise.all(
						offers.docs.map((offer: QueryDocumentSnapshot) =>
							offer.ref.delete()
						)
					)
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

export const OnOfferRejected: CloudFunction<Change<QueryDocumentSnapshot>> =
	region(REGIONS.CENTRAL)
		.firestore.document('offers/{offerId}')
		.onUpdate((change: Change<QueryDocumentSnapshot>) => {
			try {
				const newValue = change.after.data() as Offer
				const previousValue = change.before.data() as Offer

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
 * Firebase Firestore - Update the `Players` Firestore Document for the player when they create a new `Team` Firestore Document. Delete `Offer` Firestore Documents for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_new_document_is_created_2 Trigger a function when a document is created.}
 */

export const OnTeamCreated: CloudFunction<QueryDocumentSnapshot> = region(
	REGIONS.CENTRAL
)
	.firestore.document('teams/{teamId}')
	.onCreate(async (queryDocumentSnapshot: QueryDocumentSnapshot) => {
		try {
			const teamRef = queryDocumentSnapshot.ref
			const playerRef = queryDocumentSnapshot
				.data()
				.captains.pop() as DocumentReference

			// Delete all the `Offers` Firestore Documents for the player.
			const firestore = getFirestore()
			const offers = await firestore
				.collection('offers')
				.where('player', '==', playerRef)
				.get()

			return Promise.all([
				playerRef.update({
					captain: true,
					team: teamRef,
				}),
				offers.docs.map((offer: QueryDocumentSnapshot) => offer.ref.delete()),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Firebase Firestore - Update the `Players` Firestore Document for the player when a new `Customers` `Payments` Firestore Document is created.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_new_document_is_created_2 Trigger a function when a document is created.}
 */

export const OnPaymentCreated: CloudFunction<QueryDocumentSnapshot> = region(
	REGIONS.CENTRAL
)
	.firestore.document('customers/{uid}/payments/{sid}')
	.onCreate(
		(
			queryDocumentSnapshot: QueryDocumentSnapshot,
			eventContext: EventContext<{ uid: string; sid: string }>
		) => {
			try {
				const firestore = getFirestore()
				return firestore
					.collection('players')
					.doc(eventContext.params.uid)
					.update({
						registered: true,
					})
			} catch (error) {
				logger.error(error)
				return error
			}
		}
	)

/**
 * Firebase Firestore - Delete the `Teams` Firestore Document for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnTeamDeleted: CloudFunction<QueryDocumentSnapshot> = region(
	REGIONS.CENTRAL
)
	.firestore.document('teams/{teamId}')
	.onDelete(async (queryDocumentSnapshot: QueryDocumentSnapshot) => {
		try {
			const promises = []

			// Update all `Players` left on the deleted team.
			const team = queryDocumentSnapshot.data() as Team

			promises.push(
				team.roster.map((player) =>
					player.update({
						captain: false,
						team: null,
					})
				)
			)

			// Delete all `Offers` left for the team.
			const firestore = getFirestore()
			const offers = await firestore
				.collection('offers')
				.where('team', '==', queryDocumentSnapshot.ref)
				.get()

			promises.push(offers.docs.map((offer) => offer.ref.delete()))

			return Promise.all(promises)
		} catch (error) {
			logger.error(error)
			return error
		}
	})
