import { initializeApp } from './initializeApp'
import { Response } from 'express'
import { } from '@dropbox/sign'
import { SignatureRequestApi } from '@dropbox/sign/types/api/signatureRequestApi'
import { SubSigningOptions } from '@dropbox/sign/types/model/subSigningOptions'
import { EventCallbackRequest } from '@dropbox/sign/types/model/eventCallbackRequest'
import { EventCallbackHelper } from '@dropbox/sign/types/model/eventCallbackHelper'
import { Change } from 'firebase-functions/lib/common/change'
import { CloudFunction } from 'firebase-functions/v1'
import { EventContext } from 'firebase-functions/v1'
import { HttpsFunction } from 'firebase-functions/v1'
import { region } from 'firebase-functions/v1'
import { debug as logDebug } from 'firebase-functions/lib/logger'
import { error as logError } from 'firebase-functions/lib/logger'
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore'
import { UserRecord } from 'firebase-functions/v1/auth'
import { Request } from 'firebase-functions/v1/https'
import {
	DocumentData,
	DocumentReference,
	FieldValue,
	getFirestore,
	Timestamp,
} from 'firebase-admin/firestore'

const DROPBOX_SIGN_API_KEY = 'DROPBOX_SIGN_API_KEY'

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

const firestore = getFirestore()
const dropbox = new SignatureRequestApi()

// Configure HTTP basic authorization: api_key
dropbox.username = DROPBOX_SIGN_API_KEY

/**
 * When a user is deleted via Firebase Authentication, delete the corresponding `Players` document, update the corresponding `Teams` document, and delete the corresponding `Offers` documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnUserDeleted: CloudFunction<UserRecord> = region(REGIONS.CENTRAL)
	.auth.user()
	.onDelete(async (user: UserRecord) => {
		try {
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
			logError(error)
			return error
		}
	})

/**
 * When an offer is accepted, update the corresponding `Player` document, update the corresponding `Team` document, and delete all the coresponding `Offer` documents.
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

					// Delete all the offers for the player.
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
				logError(error)
				return error
			}
		})

/**
 * When an offer is rejected, delete the corresponding `Offer` document.
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
				logError(error)
				return error
			}
		})

/**
 * When a payment is created, send a signature request, and update the corresponding `Player` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_new_document_is_created_2 Trigger a function when a document is created.}
 */

export const OnPaymentCreated: CloudFunction<QueryDocumentSnapshot> = region(
	REGIONS.CENTRAL
)
	.firestore.document('customers/{uid}/payments/{sid}')
	.onCreate(
		async (
			queryDocumentSnapshot: QueryDocumentSnapshot,
			eventContext: EventContext<{ uid: string; sid: string }>
		) => {
			try {
				const player = (
					await firestore
						.collection('players')
						.doc(eventContext.params.uid)
						.get()
				).data() as Player

				return Promise.all([
					firestore.collection('players').doc(eventContext.params.uid).update({
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
			} catch (error) {
				logError(error)
				return error
			}
		}
	)

/**
 * When a waiver is signed, update the corresponding `Team` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnPlayerSignedChange: CloudFunction<
	Change<QueryDocumentSnapshot>
> = region(REGIONS.CENTRAL)
	.firestore.document('players/{playerId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data() as Player
			const previousValue = change.before.data() as Player

			if (newValue.signed != previousValue.signed) {
				const registeredPlayers = (
					await firestore
						.collection('players')
						.where('team', '==', newValue.team)
						.where('paid', '==', true)
						.where('signed', '==', true)
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
			logError(error)
			return error
		}
	})

/**
 * @deprecated since version 2.0 - we can delete this, because waivers will never be signed before payments are made, I think...
 *
 * When a payment is made, update the corresponding `Team` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const SetTeamRegistered_OnPlayerPaidChange: CloudFunction<
	Change<QueryDocumentSnapshot>
> = region(REGIONS.CENTRAL)
	.firestore.document('players/{playerId}')
	.onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
		try {
			const newValue = change.after.data() as Player
			const previousValue = change.before.data() as Player

			if (newValue.paid != previousValue.paid) {
				const registeredPlayers = (
					await firestore
						.collection('players')
						.where('team', '==', newValue.team)
						.where('paid', '==', true)
						.where('signed', '==', true)
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
			logError(error)
			return error
		}
	})

/**
 * When a team roster changes, update the corresponding `Team` document to reflect the registration status.
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
				const registeredPlayers = (
					await firestore
						.collection('players')
						.where('team', '==', teamRef)
						.where('paid', '==', true)
						.where('signed', '==', true)
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
			logError(error)
			return error
		}
	})

/**
 * When a team roster changes, update the corresponding `Team` document to reflect the time of the registration status change.
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
			logError(error)
			return error
		}
	})

/**
 * When Dropbox Sign sends a `signature_request_signed` callback event, update the corresponding `Player` document to reflect the signed status.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/http-events?gen=1st#trigger_a_function_with_an_http_request_2 Trigger a function with an HTTP request.}
 */

export const dropboxSignHandleWebhookEvents: HttpsFunction = region(
	REGIONS.CENTRAL
).https.onRequest(async (req: Request, resp: Response<string>) => {
	logDebug(req.body)
	const callback_data = JSON.parse(req.body.json)
  const callback_event = EventCallbackRequest.init(callback_data)
  
	// Verify that a callback came from Dropbox Sign.
	if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callback_event)) {
		// one of "account_callback" or "api_app_callback"
    const callback_type = EventCallbackHelper.getCallbackType(callback_event)
    logDebug(callback_data)
    logDebug(callback_event)
    logDebug(callback_type)

		// do your magic below!
	}

	// Parse the request body to get the event type and the event data, ensure it's a signature_request_signed event.

	// Get the player ID from the event data.

	// Update the player document to reflect the signed status.

	resp.status(200).send('Hello API event received')
})
