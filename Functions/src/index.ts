import { initializeApp } from './initializeApp.js'

// Dropbox Sign SDK
import {
	EventCallbackHelper,
	EventCallbackRequest,
	EventCallbackRequestEvent,
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
import { error } from 'firebase-functions/logger'

// Firebase Firestore SDK
import {
	CollectionReference,
	DocumentData,
	DocumentReference,
	FieldValue,
	Timestamp,
	WriteResult,
	getFirestore,
} from 'firebase-admin/firestore'

interface PlayerData extends DocumentData {
	admin: boolean
	email: string
	firstname: string
	lastname: string
	seasons: {
		captain: boolean
		paid: boolean
		season: DocumentReference<SeasonData, DocumentData>
		signed: boolean
		team: DocumentReference<TeamData, DocumentData> | null
	}[]
}
interface TeamData extends DocumentData {
	logo: string
	name: string
	placement: number
	registered: boolean
	registeredDate: Timestamp
	roster: {
		captain: boolean
		player: DocumentReference<PlayerData, DocumentData>
	}[]
	season: DocumentReference<SeasonData, DocumentData>
	storagePath: string
	teamId: string
}

interface SeasonData extends DocumentData {
	dateEnd: Timestamp
	dateStart: Timestamp
	name: string
	registrationEnd: Timestamp
	registrationStart: Timestamp
	teams: DocumentReference<TeamData, DocumentData>[]
}

interface OfferData extends DocumentData {
	creator: string
	player: DocumentReference<PlayerData, DocumentData>
	status: string
	team: DocumentReference<TeamData, DocumentData>
}
interface WaiverData extends DocumentData {
	player: DocumentReference<PlayerData>
}

const REGION = 'us-central1'

const COLLECTIONS = {
	SEASONS: 'seasons',
	WAIVERS: 'waivers',
	OFFERS: 'offers',
	PLAYERS: 'players',
}

enum Offers {
	ACCEPTED = 'accepted',
	PENDING = 'pending',
	REJECTED = 'rejected',
}

const FIELDS = {
	PLAYER: 'player',
	TEAM: 'team',
	PAID: 'paid',
	SIGNED: 'signed',
	SIGNATUREREQUESTID: 'signatureRequestId',
}

const DROPBOX_SIGN_API_KEY = 'DROPBOX_SIGN_API_KEY'
const DROPBOX_TEMPLATE_ID = '0fb30e5f0123f06cc20fe3155f51a539c65f9218'

initializeApp()

// Fixed August 27, 2024.
/**
 * When a user is deleted via Firebase Authentication, delete the corresponding `Players` document, update the corresponding `Teams` documents, and delete the corresponding `Offers` documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_deletion Trigger a function on user deletion.}
 */

export const OnUserDeleted = functions
	.region(REGION)
	.auth.user()
	.onDelete((user) => {
		try {
			const firestore = getFirestore()

			const playerRef = firestore
				.collection(COLLECTIONS.PLAYERS)
				.doc(user.uid) as DocumentReference<PlayerData, DocumentData>

			// Delete all the offers for the player.
			const offersDeletionPromises = firestore
				.collection(COLLECTIONS.OFFERS)
				.where(FIELDS.PLAYER, '==', playerRef)
				.get()
				.then((offers) => offers.docs.map((offer) => offer.ref.delete()))

			// Remove player from all their teams.
			const teamsUpdatePromises = playerRef.get().then((player) =>
				player.data()?.seasons.map((item) =>
					item.team?.get().then((teamDocumentSnapshot) =>
						item.team?.update({
							roster: teamDocumentSnapshot
								?.data()
								?.roster.filter((item) => item.player.id !== user.uid),
						})
					)
				)
			)

			// Delete player.
			const deletePlayerPromise = playerRef.delete()

			return Promise.all([
				offersDeletionPromises,
				teamsUpdatePromises,
				deletePlayerPromise,
			])
		} catch (e) {
			error(e)
			return e
		}
	})

// Fixed August 27, 2024.
/**
 * When an offer is accepted, update the corresponding `Player` document, update the corresponding `Team` document, and delete all the coresponding `Offer` documents.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */

export const OnOfferAccepted = onDocumentUpdated(
	{ document: 'offers/{offerId}', region: REGION },
	async (event) => {
		try {
			const firestore = getFirestore()

			const newValue = event.data?.after.data() as OfferData
			const previousValue = event.data?.before.data() as OfferData

			if (
				previousValue.status === Offers.PENDING &&
				newValue.status === Offers.ACCEPTED
			) {
				const playerDocumentReference = newValue.player
				const teamDocumentReference = newValue.team

				const seasonsCollectionReference = firestore.collection(
					COLLECTIONS.SEASONS
				) as CollectionReference<SeasonData, DocumentData>

				// Update player document - Add team to the player's seasons.
				const updatePlayerPromise = seasonsCollectionReference
					.get()
					.then((seasonQuerySnapshot): Promise<void | WriteResult> => {
						const currentSeason = seasonQuerySnapshot.docs
							.sort(
								(a, b) =>
									b.data().dateStart.seconds - a.data().dateStart.seconds
							)
							.find((season) => season)

						if (!currentSeason) return Promise.resolve()
						return playerDocumentReference
							.get()
							.then((playerDocumentSnapshot) =>
								playerDocumentReference.update({
									seasons: playerDocumentSnapshot.data()?.seasons.map((item) =>
										item.season.id == currentSeason?.id
											? {
													captain: item.captain,
													paid: item.paid,
													season: item.season,
													signed: item.signed,
													team: teamDocumentReference,
												}
											: item
									),
								})
							)
					})

				// Update team document.
				const updateTeamPromise = teamDocumentReference
					.get()
					.then((teamDocumentSnapshot) => {
						const roster = teamDocumentSnapshot.data()?.roster
						roster?.push({
							captain: false,
							player: playerDocumentReference,
						})
						teamDocumentReference.update({
							roster: roster,
						})
					})

				// Delete all the offers for the player.
				const offersDeletionPromises = firestore
					.collection(COLLECTIONS.OFFERS)
					.where(FIELDS.PLAYER, '==', newValue.player)
					.get()
					.then((offers) => offers.docs.map((offer) => offer.ref.delete()))

				return Promise.all([
					updatePlayerPromise,
					updateTeamPromise,
					offersDeletionPromises,
				])
			}

			return
		} catch (e) {
			error(e)
			return e
		}
	}
)

// Fixed August 27, 2024.
/**
 * When an offer is rejected, delete the corresponding `Offer` document.
 *
 * Firebase Documentation: {@link https://firebase.google.com/docs/functions/firestore-events?gen=1st#trigger_a_function_when_a_document_is_updated_2 Trigger a function when a document is updated.}
 */
export const OnOfferRejected = onDocumentUpdated(
	{ document: 'offers/{offerId}', region: REGION },
	async (event) => {
		try {
			const newValue = event.data?.after.data() as OfferData
			const previousValue = event.data?.before.data() as OfferData

			if (
				newValue.status === Offers.REJECTED &&
				previousValue.status === Offers.PENDING
			) {
				return Promise.all([event.data?.after.ref.delete()])
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
			const firestore = getFirestore()
			const dropbox = new SignatureRequestApi()
			dropbox.username = DROPBOX_SIGN_API_KEY

			return firestore
				.collection(COLLECTIONS.PLAYERS)
				.doc(event.params.uid)
				.update({
					paid: true,
				})
				.then(() => {
					firestore
						.collection(COLLECTIONS.PLAYERS)
						.doc(event.params.uid)
						.get()
						.then((playerSnapshot) => {
							const player = playerSnapshot.data() as PlayerData
							dropbox
								.signatureRequestSendWithTemplate({
									templateIds: [DROPBOX_TEMPLATE_ID],
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
								})
								.then((response) => {
									const signatureRequest = response.body.signatureRequest
									if (signatureRequest) {
										const signatureRequestId =
											signatureRequest.signatureRequestId
										if (signatureRequestId) {
											return firestore
												.collection(COLLECTIONS.WAIVERS)
												.doc(signatureRequestId)
												.set({
													player: firestore
														.collection(COLLECTIONS.PLAYERS)
														.doc(event.params.uid),
												})
										}
									}
									return
								})
						})
				})
		} catch (e) {
			error(e)
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
			const firestore = getFirestore()

			const newValue = event.data?.after.data() as PlayerData
			const previousValue = event.data?.before.data() as PlayerData

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
			const firestore = getFirestore()

			const newValue = event.data?.after.data() as PlayerData
			const previousValue = event.data?.before.data() as PlayerData

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
			const firestore = getFirestore()

			const newValue = event.data?.after.data() as TeamData
			const previousValue = event.data?.before.data() as TeamData
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
			const newValue = event.data?.after.data() as TeamData
			const previousValue = event.data?.before.data() as TeamData
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
		try {
			const firestore = getFirestore()

			const data = req.body.toString().match(/\{.*\}/s)[0]

			const callback_data = JSON.parse(data)

			const callback_event = EventCallbackRequest.init(callback_data)

			// Verify that a callback came from Dropbox Sign.
			if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callback_event)) {
				if (
					callback_event.event.eventType ==
					EventCallbackRequestEvent.EventTypeEnum.SignatureRequestSigned
				) {
					const signatureRequest = callback_event.signatureRequest

					if (signatureRequest) {
						const signatureRequestId = signatureRequest.signatureRequestId

						if (signatureRequestId) {
							const waiverSnapshot = await firestore
								.collection(COLLECTIONS.WAIVERS)
								.doc(signatureRequestId)
								.get()

							const waiver = waiverSnapshot.data() as WaiverData

							await waiver.player.update({
								signed: true,
							})
						}
					}
				}
			}
		} catch (e) {
			error(e)
		} finally {
			resp.status(200).send('Hello API event received')
		}
	}
)
