import {
	addDoc,
	doc,
	query,
	where,
	getFirestore,
	DocumentData,
	FirestoreError,
	updateDoc,
	UpdateData,
	collection,
	onSnapshot,
	Unsubscribe,
	DocumentSnapshot,
	DocumentReference,
	CollectionReference,
	QuerySnapshot,
	Query,
} from 'firebase/firestore'

import { app } from './app'
import { User } from './auth'
import { Products } from './stripe'

interface PlayerDocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference
}

// interface OfferDocumentData {
// 	creator: 'player' | 'captain'
// 	player: DocumentReference
// 	status: 'pending' | 'accepted' | 'rejected'
// 	team: DocumentReference
// }

const firestore = getFirestore(app)

const invitePlayerToJoinTeam = async (
	playerRef: DocumentReference,
	teamRef: DocumentReference
): Promise<DocumentReference<DocumentData, DocumentData>> => {
	return await addDoc(collection(firestore, 'offers'), {
		creator: 'captain',
		player: playerRef,
		team: teamRef,
		status: 'pending',
	})
}

const requestToJoinTeam = async (
	playerRef: DocumentReference,
	teamRef: DocumentReference
): Promise<DocumentReference<DocumentData, DocumentData>> => {
	return await addDoc(collection(firestore, 'offers'), {
		creator: 'player',
		player: playerRef,
		team: teamRef,
		status: 'pending',
	})
}

const playerDocRef = (
	authValue: User | null | undefined
): DocumentReference<DocumentData, DocumentData> | undefined => {
	return authValue ? doc(firestore, 'players', authValue.uid) : undefined
}

const updatePlayerDoc = async (
	authValue: User | null | undefined,
	data: UpdateData<PlayerDocumentData>
) => {
	return authValue
		? updateDoc(doc(firestore, 'players', authValue.uid), data)
		: undefined
}

const teamsColRef = (): CollectionReference<DocumentData, DocumentData> => {
	return collection(firestore, 'teams')
}

const outgoingOffersColRef = (
	documentDataSnapshot: DocumentSnapshot<DocumentData, DocumentData> | undefined
): Query<DocumentData, DocumentData> | undefined => {
	if (!documentDataSnapshot) return undefined

	// If the user is a captain, show all the invitations to join their team.
	if (documentDataSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', documentDataSnapshot.data()?.team),
			where('creator', '==', 'captain')
		)
	}

	// If the user is a player, show all their requests to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', documentDataSnapshot.ref),
		where('creator', '==', 'player')
	)
}

const incomingOffersColRef = (
	documentDataSnapshot: DocumentSnapshot<DocumentData, DocumentData> | undefined
): Query<DocumentData, DocumentData> | undefined => {
	if (!documentDataSnapshot) return undefined

	// If the user is a captain, show all the requests to join their team.
	if (documentDataSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', documentDataSnapshot.data()?.team),
			where('creator', '==', 'player')
		)
	}

	// If the user is a player, show all their invitations to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', documentDataSnapshot.ref),
		where('creator', '==', 'captain')
	)
}

const stripeRegistration = async (
	authValue: User | null | undefined
): Promise<Unsubscribe> => {
	// Create new Checkout Session for the player
	const docRef = await addDoc(
		collection(firestore, `customers/${authValue?.uid}/checkout_sessions`),
		{
			mode: 'payment',
			price: Products.MinnesotaWinterLeagueRegistration2023Test,
			success_url: window.location.origin,
			cancel_url: window.location.origin,
		}
	)

	// Listen for the URL of the Checkout Session
	return onSnapshot(docRef, (docSnap) => {
		const data = docSnap.data()
		if (data) {
			if (data.url) {
				console.log('Checkout Session URL:', data.url)
			} else {
				console.log('Creating Checkout Session')
			}
		} else {
			console.log('Creating Checkout Session')
		}
	})
}

export {
	requestToJoinTeam,
	invitePlayerToJoinTeam,
	teamsColRef,
	outgoingOffersColRef,
	incomingOffersColRef,
	playerDocRef,
	updatePlayerDoc,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	type QuerySnapshot,
	type DocumentReference,
	stripeRegistration,
}
