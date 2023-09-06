import {
	addDoc,
	doc,
	query,
	where,
  getDoc,
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

const firestore = getFirestore(app)

const acceptOffer = async (offerRef: DocumentReference): Promise<void> => {
	return await updateDoc(offerRef, {
		status: 'accepted',
	})
}

const rejectOffer = async (offerRef: DocumentReference): Promise<void> => {
	return await updateDoc(offerRef, {
		status: 'rejected',
	})
}

const createTeam = async (playerRef: DocumentReference): Promise<void> => {
	await addDoc(collection(firestore, 'teams'), {
		captains: [playerRef],
		logo: '',
		name: '',
		registered: false,
		roster: [playerRef],
	})

	// await updateDoc(playerRef, { captain: true, team: teamRef })
}

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

const getPlayerData = async (
	playerDocRef: DocumentReference<DocumentData, DocumentData>
): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
	return await getDoc(playerDocRef)
}

const getOffersForUnrosteredPlayer = (
	playerDocRef: DocumentReference<DocumentData, DocumentData>,
	teamDocRef: DocumentReference<DocumentData, DocumentData>
): Query<DocumentData, DocumentData> => {
	return query(
		collection(firestore, 'offers'),
		where('team', '==', teamDocRef),
		where('player', '==', playerDocRef)
	)
}

const getOffersListener = (
	teamDocRef: DocumentReference<DocumentData, DocumentData>,
	playerDocRef: DocumentReference<DocumentData, DocumentData>,
	action: (arg: QuerySnapshot<DocumentData, DocumentData>) => void
) => {
	return onSnapshot(
		query(
			collection(firestore, 'offers'),
			where('team', '==', teamDocRef),
			where('player', '==', playerDocRef)
		),
		(querySnapshot) => {
			action(querySnapshot)
		}
	)
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

const teamsQuery = (): Query<DocumentData, DocumentData> => {
	return query(collection(firestore, 'teams'))
}

const offersForUnrosteredPlayersQuery = (
	teamDocRef: DocumentReference<DocumentData, DocumentData>,
	playerDocRef: DocumentReference<DocumentData, DocumentData>
): Query<DocumentData, DocumentData> => {
	return query(
		collection(firestore, 'offers'),
		where('team', '==', teamDocRef),
		where('player', '==', playerDocRef)
	)
}

const unrosteredPlayersQuery = (): Query<DocumentData, DocumentData> => {
	return query(collection(firestore, 'players'), where('team', '==', null))
}

const outgoingOffersQuery = (
	documentSnapshot: DocumentSnapshot<DocumentData, DocumentData> | undefined
): Query<DocumentData, DocumentData> | undefined => {
	if (!documentSnapshot) return undefined

	// If the user is a captain, show all the invitations to join their team.
	if (documentSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', documentSnapshot.data()?.team),
			where('creator', '==', 'captain')
		)
	}

	// If the user is a player, show all their requests to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', documentSnapshot.ref),
		where('creator', '==', 'player')
	)
}

const incomingOffersQuery = (
	documentSnapshot: DocumentSnapshot<DocumentData, DocumentData> | undefined
): Query<DocumentData, DocumentData> | undefined => {
	if (!documentSnapshot) return undefined

	// If the user is a captain, show all the requests to join their team.
  if (documentSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', documentSnapshot.data()?.team),
			where('creator', '==', 'player')
		)
	}

	// If the user is a player, show all their invitations to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', documentSnapshot.ref),
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
	acceptOffer,
	rejectOffer,
	getPlayerData,
	requestToJoinTeam,
	invitePlayerToJoinTeam,
	teamsQuery,
	outgoingOffersQuery,
	offersForUnrosteredPlayersQuery,
	incomingOffersQuery,
	playerDocRef,
	updatePlayerDoc,
	getOffersListener,
	createTeam,
	stripeRegistration,
	unrosteredPlayersQuery,
	getOffersForUnrosteredPlayer,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	type QuerySnapshot,
	type DocumentReference,
}
