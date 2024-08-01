import { initializeApp } from './initializeApp.js'

// Dropbox Sign SDK
import {
	HttpError,
	EventCallbackHelper,
	EventCallbackRequest,
	SignatureRequestApi,
	SubSigningOptions,
} from '@dropbox/sign'

// Firebase Functions SDK - Gen 1
import functions from 'firebase-functions'

// Firebase Functions SDK - Gen 2
import {
	onDocumentUpdated,
	onDocumentCreated,
} from 'firebase-functions/v2/firestore'
import { onRequest } from 'firebase-functions/v2/https'
import { debug, error } from 'firebase-functions/logger'

// Firebase Firestore SDK
import {
	DocumentData,
	DocumentReference,
	FieldValue,
	Timestamp,
	getFirestore,
} from 'firebase-admin/firestore'

interface Player extends DocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	paid: boolean
	signed: boolean
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

const REGION = 'us-central1'

const COLLECTIONS = {
	OFFERS: 'offers',
	PLAYERS: 'players',
}

const FIELDS = {
	PLAYER: 'player',
	TEAM: 'team',
	PAID: 'paid',
	SIGNED: 'signed',
}

const DROPBOX_SIGN_API_KEY = 'DROPBOX_SIGN_API_KEY'

initializeApp()

const firestore = getFirestore()
const dropbox = new SignatureRequestApi()

// Configure HTTP basic authorization: api_key
dropbox.username = DROPBOX_SIGN_API_KEY

/**
 * When a user is deleted via Firebase Authentication, delete the corresponding `Players` document, update the corresponding `Teams` document, and delete the corresponding `Offers` documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnUserDeleted = functions
	.region(REGION)
	.auth.user()
	.onDelete(async (user) => {
		try {
			const playerRef = firestore.collection(COLLECTIONS.PLAYERS).doc(user.uid)

			// Delete all the `Offers` Firestore Documents for the player.
			const offers = await firestore
				.collection(COLLECTIONS.OFFERS)
				.where(FIELDS.PLAYER, '==', playerRef)
				.get()

			const offersDeletionPromises = offers.docs.map((offer) =>
				offer.ref.delete()
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
		} catch (e) {
			error(e)
			return e
		}
	})

/**
 * When an offer is accepted, update the corresponding `Player` document, update the corresponding `Team` document, and delete all the coresponding `Offer` documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const OnOfferAccepted = onDocumentUpdated(
	{ document: 'offers/{offerId}', region: REGION },
	async (event) => {
		try {
			const newValue = event.data?.after.data() as Offer
			const previousValue = event.data?.after.data() as Offer

			if (
				newValue.status === 'accepted' &&
				previousValue.status === 'pending'
			) {
				// Add the team to the player.
				await newValue.player.update({
					team: newValue.team,
				})

				// Add the player to the team.
				await newValue.team.update({
					roster: FieldValue.arrayUnion(newValue.player),
				})

				// Delete all the offers for the player.
				const offers = await firestore
					.collection(COLLECTIONS.OFFERS)
					.where(FIELDS.PLAYER, '==', newValue.player)
					.get()

				return Promise.all(offers.docs.map((offer) => offer.ref.delete()))
			}

			return
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * When an offer is rejected, delete the corresponding `Offer` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */
export const OnOfferRejected = onDocumentUpdated(
	{ document: 'offers/{offerId}', region: REGION },
	async (event) => {
		try {
			const newValue = event.data?.after.data() as Offer
			const previousValue = event.data?.after.data() as Offer

			if (
				newValue.status === 'rejected' &&
				previousValue.status === 'pending'
			) {
				return event.data?.after.ref.delete()
			}

			return
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * When a payment is created, send a signature request, and update the corresponding `Player` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_new_document_is_created_2 Trigger a function when a document is created.}
 */

export const OnPaymentCreated = onDocumentCreated(
	{ document: 'customers/{uid}/payments/{sid}', region: REGION },
	async (event) => {
		try {
			const player = (
				await firestore
					.collection(COLLECTIONS.PLAYERS)
					.doc(event.params.uid)
					.get()
			).data() as Player

			return Promise.all([
				firestore.collection(COLLECTIONS.PLAYERS).doc(event.params.uid).update({
					paid: true,
				}),
				dropbox.signatureRequestSendWithTemplate({
					templateIds: ['0fb30e5f0123f06cc20fe3155f51a539c65f9218'],
					subject: 'Minneapolis Winter League - Release of Liability',
					message:
						"We're so excited you decided to join Minneapolis Winter League. " +
						'Please make sure to sign this Release of Liability to finalize ' +
						'your participation. Looking forward to seeing you!',
					signers: [
						{
							role: 'Participant',
							name: `${player.firstname} ${player.lastname}`,
							emailAddress: player.email,
						},
					],
					signingOptions: {
						draw: true,
						type: true,
						upload: true,
						phone: false,
						defaultType: SubSigningOptions.DefaultTypeEnum.Type,
					},
					testMode: true,
				}),
			])
		} catch (e) {
			if (e instanceof HttpError) {
				error(e.response)
				error(e.body)
				error(e.message)
				error(e.cause)
				error(e.name)
				error(e.statusCode)
				error(e.stack)
			}
			return e
		}
	}
)

/**
 * When a waiver is signed, update the corresponding `Team` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnPlayerSignedChange = onDocumentUpdated(
	{ document: 'players/{playerId}', region: REGION },

	async (event) => {
		try {
			const newValue = event.data?.after.data() as Player
			const previousValue = event.data?.before.data() as Player

			if (newValue.signed != previousValue.signed) {
				const registeredPlayers = (
					await firestore
						.collection(COLLECTIONS.PLAYERS)
						.where(FIELDS.TEAM, '==', newValue.team)
						.where(FIELDS.PAID, '==', true)
						.where(FIELDS.SIGNED, '==', true)
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
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * @deprecated since version 2.0 - we can delete this, because waivers will never be signed before payments are made, I think...
 *
 * When a payment is made, update the corresponding `Team` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnPlayerPaidChange = onDocumentUpdated(
	{ document: 'players/{playerId}', region: REGION },

	async (event) => {
		try {
			const newValue = event.data?.after.data() as Player
			const previousValue = event.data?.before.data() as Player

			if (newValue.paid != previousValue.paid) {
				const registeredPlayers = (
					await firestore
						.collection(COLLECTIONS.PLAYERS)
						.where(FIELDS.TEAM, '==', newValue.team)
						.where(FIELDS.PAID, '==', true)
						.where(FIELDS.SIGNED, '==', true)
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
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * When a team roster changes, update the corresponding `Team` document to reflect the registration status.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnTeamRosterChange = onDocumentUpdated(
	{ document: 'teams/{teamId}', region: REGION },
	async (event) => {
		try {
			const newValue = event.data?.after.data() as Team
			const previousValue = event.data?.before.data() as Team
			const teamRef = event.data?.after.ref

			if (newValue.roster.length != previousValue.roster.length) {
				const registeredPlayers = (
					await firestore
						.collection(COLLECTIONS.PLAYERS)
						.where(FIELDS.TEAM, '==', teamRef)
						.where(FIELDS.PAID, '==', true)
						.where(FIELDS.SIGNED, '==', true)
						.count()
						.get()
				).data().count

				if (registeredPlayers >= 10) {
					return teamRef?.update({
						registered: true,
					})
				} else {
					return teamRef?.update({
						registered: false,
					})
				}
			}

			return
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * When a team roster changes, update the corresponding `Team` document to reflect the time of the registration status change.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegisteredDate_OnTeamRegisteredChange = onDocumentUpdated(
	{ document: 'teams/{teamId}', region: REGION },
	async (event) => {
		try {
			const newValue = event.data?.after.data() as Team
			const previousValue = event.data?.before.data() as Team
			const teamRef = event.data?.after.ref

			if (newValue.registered != previousValue.registered) {
				return teamRef?.update({
					registeredDate: FieldValue.serverTimestamp(),
				})
			}

			return
		} catch (e) {
			error(e)
			return e
		}
	}
)

/**
 * When Dropbox Sign sends a `signature_request_signed` callback event, update the corresponding `Player` document to reflect the signed status.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/http-events?gen=1st#trigger_a_function_with_an_http_request_2 Trigger a function with an HTTP request.}
 */

export const dropboxSignHandleWebhookEvents = onRequest(
	{ region: REGION },
	async (req, resp) => {
		debug(req.body)
		const callback_data = JSON.parse(req.body.json)
		const callback_event = EventCallbackRequest.init(callback_data)

		// Verify that a callback came from Dropbox Sign.
		if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callback_event)) {
			// one of "account_callback" or "api_app_callback"
			const callback_type = EventCallbackHelper.getCallbackType(callback_event)
			debug(callback_data)
			debug(callback_event)
			debug(callback_type)

			// do your magic below!
		}

		// Parse the request body to get the event type and the event data, ensure it's a signature_request_signed event.

		// Get the player ID from the event data.

		// Update the player document to reflect the signed status.

		resp.status(200).send('Hello API event received')
	}
)
