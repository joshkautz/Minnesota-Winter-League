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
	HttpsFunction,
	logger,
	region,
	https,
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
	Timestamp,
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
	registeredDate: Timestamp
	roster: DocumentReference<Player>[]
}

interface Offer extends DocumentData {
	creator: string
	player: DocumentReference<Player>
	status: string
	team: DocumentReference<Team>
}

/**
 * Cloud Firestore trigger - Delete the `Players` Firestore Document for the player. Update the `Teams` Firestore Document for the player. Delete the `Offers` Firestore Documents for the player.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnUserDeleted: CloudFunction<UserRecord> = region(REGIONS.CENTRAL)
	.auth.user()
	.onDelete(async (user: UserRecord) => {
		try {
			const firestore = getFirestore()
			const playerRef = firestore
				.collection(COLLECTIONS.PLAYERS)
				.doc(user.uid) as DocumentReference<Player>

			// Delete all the `Offers` Firestore Documents for the player.
			const offers = await firestore
				.collection('offers')
				.where('player', '==', playerRef)
				.get()

			const offersDeletionPromises = offers.docs.map(
				(offer: QueryDocumentSnapshot) => offer.ref.delete()
			)

			// Update the `Teams` Firestore Documents for the player.
			const player = await playerRef.get()
			const teamUpdatePromise = player.data()?.team?.update({
				captains: FieldValue.arrayRemove(playerRef),
				roster: FieldValue.arrayRemove(playerRef),
			})

			return Promise.all([
				offersDeletionPromises,
				teamUpdatePromise,
				playerRef.delete(),
			])
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Cloud Firestore trigger - Add the player to the team. Add the team to the player. Delete all the `Offers` Firestore Documents for the player.
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
 * Cloud Firestore trigger - Delete the rejected `Offers` Firestore Document for the player.
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
					return change.after.ref.delete()
				}

				return
			} catch (error) {
				logger.error(error)
				return error
			}
		})

/**
 * Cloud Firestore trigger - Update the `Players` Firestore Document for the player when a new `Customers` `Payments` Firestore Document is created.
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
 * Cloud Firestore trigger - Evaluate and set the registered value of a `Teams` Firestore Document when a player's registered field changes.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnPlayerRegisteredChange: CloudFunction<
	Change<QueryDocumentSnapshot>
> = region(REGIONS.CENTRAL)
	.firestore.document('players/{playerId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data() as Player
			const previousValue = change.before.data() as Player

			if (newValue.registered != previousValue.registered) {
				const firestore = getFirestore()

				const registeredPlayers = (
					await firestore
						.collection('players')
						.where('team', '==', newValue.team)
						.where('registered', '==', true)
						.count()
						.get()
				).data().count

				if (registeredPlayers >= 10) {
					return newValue.team?.update({
						registered: true,
					})
				} else {
					return newValue.team?.update({
						registered: false,
					})
				}
			}

			return
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Cloud Firestore trigger - Evaluate and set the registered value of a `Teams` Firestore Document when the team's roster field changes.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnTeamRosterChange: CloudFunction<
	Change<QueryDocumentSnapshot>
> = region(REGIONS.CENTRAL)
	.firestore.document('teams/{teamId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data() as Team
			const previousValue = change.before.data() as Team
			const teamRef = change.after.ref

			if (newValue.roster.length != previousValue.roster.length) {
				const firestore = getFirestore()

				const registeredPlayers = (
					await firestore
						.collection('players')
						.where('team', '==', teamRef)
						.where('registered', '==', true)
						.count()
						.get()
				).data().count

				if (registeredPlayers >= 10) {
					return teamRef.update({
						registered: true,
					})
				} else {
					return teamRef.update({
						registered: false,
					})
				}
			}

			return
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * Cloud Firestore trigger - Set the registeredDate value of a `Teams` Firestore Document when the team's registered field changes.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegisteredDate_OnTeamRegisteredChange: CloudFunction<
	Change<QueryDocumentSnapshot>
> = region(REGIONS.CENTRAL)
	.firestore.document('teams/{teamId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data() as Team
			const previousValue = change.before.data() as Team
			const teamRef = change.after.ref

			if (newValue.registered != previousValue.registered) {
				return teamRef.update({
					registeredDate: FieldValue.serverTimestamp(),
				})
			}

			return
		} catch (error) {
			logger.error(error)
			return error
		}
	})

/**
 * HTTP request trigger - Set the registeredDate value of a `Teams` Firestore Document when the team's registered field changes.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/http-events?gen=1st#trigger_a_function_with_an_http_request_2 Trigger a function with an HTTP request.}
 */

export const dropboxSignHandleWebhookEvents: HttpsFunction = region(
	REGIONS.CENTRAL
).https.onRequest((req: https.Request, resp) => {
	const data = JSON.parse(req.body)
	logger.log(data)

	// Webhook must respond with a 200 status code
	// and a body containing the string 'Hello API event received'
	resp.status(200).send('Hello API event received')
})
