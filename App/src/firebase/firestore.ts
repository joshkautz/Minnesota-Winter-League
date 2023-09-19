import {
	addDoc,
	deleteDoc,
	doc,
	query,
	where,
	getDoc,
	setDoc,
	getFirestore,
	DocumentData,
	FirestoreError,
	arrayRemove,
	arrayUnion,
	orderBy,
	updateDoc,
	UpdateData,
	getDocs,
	collection,
	onSnapshot,
	Unsubscribe,
	or,
	DocumentSnapshot,
	QueryDocumentSnapshot,
	DocumentReference,
	QuerySnapshot,
	Query,
} from 'firebase/firestore'

import { app } from './app'
import { User } from './auth'
import { Products } from './stripe'
import {
	CheckoutSessionData,
	GamesData,
	OfferData,
	PlayerData,
	StandingsData,
	TeamData,
} from '@/lib/interfaces'

interface PlayerDocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference<TeamData, DocumentData>
}

const firestore = getFirestore(app)

const acceptOffer = (
	offerRef: DocumentReference<OfferData, DocumentData>
): Promise<void> => {
	return updateDoc(offerRef, {
		status: 'accepted',
	})
}

const rejectOffer = (
	offerRef: DocumentReference<OfferData, DocumentData>
): Promise<void> => {
	return updateDoc(offerRef, {
		status: 'rejected',
	})
}

const createTeam = async (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	name: string,
	logo: string
): Promise<void[]> => {
	const team = await addDoc(collection(firestore, 'teams'), {
		captains: [playerRef],
		logo: logo,
		name: name,
		registered: false,
		roster: [playerRef],
	})

	await updateDoc(playerRef, {
		captain: true,
		team: team,
	})

	const offersQuerySnapshot = await getDocs(
		query(collection(firestore, 'offers'), where('player', '==', playerRef))
	)

	const offersPromises = offersQuerySnapshot.docs.map(
		(offer: QueryDocumentSnapshot) => deleteDoc(offer.ref)
	)

	return Promise.all(offersPromises)
}

const createPlayer = (
	uid: string,
	firstname: string,
	lastname: string,
	email: string
): Promise<void> => {
	return setDoc(doc(firestore, 'players', uid), {
		captain: false,
		firstname: firstname,
		lastname: lastname,
		email: email,
		registered: false,
		team: null,
	})
}

const deleteTeam = (
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<void> => {
	return deleteDoc(doc(firestore, 'teams', teamRef.id)) as Promise<void>
}

const removePlayerFromTeam = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<[void, void]> => {
	return Promise.all([
		// Update the player.
		updateDoc(playerRef, {
			captain: false,
			team: null,
		}),

		// Update the team.
		updateDoc(teamRef, {
			captains: arrayRemove(playerRef),
			roster: arrayRemove(playerRef),
		}),
	])
}

const promoteToCaptain = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<[void, void]> => {
	return Promise.all([
		// Update the team.
		updateDoc(teamRef, {
			captains: arrayUnion(playerRef),
			roster: arrayUnion(playerRef),
		}),

		// Update the player.
		updateDoc(playerRef, {
			captain: true,
			team: teamRef,
		}),
	])
}

const demoteFromCaptain = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<[void, void]> => {
	return Promise.all([
		updateDoc(teamRef, {
			captains: arrayRemove(playerRef),
		}),
		updateDoc(playerRef, {
			captain: false,
		}),
	])
}

const leaveTeam = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<[void, void]> => {
	return Promise.all([
		updateDoc(playerRef, {
			captain: false,
			team: null,
		}),
		updateDoc(teamRef, {
			captains: arrayRemove(playerRef),
			roster: arrayRemove(playerRef),
		}),
	])
}

const invitePlayerToJoinTeam = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<DocumentReference<OfferData, DocumentData>> => {
	return addDoc(collection(firestore, 'offers'), {
		creator: 'captain',
		player: playerRef,
		team: teamRef,
		status: 'pending',
	}) as Promise<DocumentReference<OfferData, DocumentData>>
}

const requestToJoinTeam = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Promise<DocumentReference<OfferData, DocumentData>> => {
	return addDoc(collection(firestore, 'offers'), {
		creator: 'player',
		player: playerRef,
		team: teamRef,
		status: 'pending',
	}) as Promise<DocumentReference<OfferData, DocumentData>>
}

const getPlayerSnapshot = (
	playerRef: DocumentReference<PlayerData, DocumentData>
): Promise<DocumentSnapshot<PlayerData, DocumentData>> => {
	return getDoc(playerRef)
}

const getPlayerRef = (
	authValue: User | null | undefined
): DocumentReference<PlayerData, DocumentData> | undefined => {
	if (!authValue) return undefined
	return doc(firestore, 'players', authValue.uid) as DocumentReference<
		PlayerData,
		DocumentData
	>
}

const getStandingsRef = ():
	| DocumentReference<StandingsData, DocumentData>
	| undefined => {
	return doc(firestore, 'standings', 'standings') as DocumentReference<
		StandingsData,
		DocumentData
	>
}

const gamesQuery = (): Query<GamesData, DocumentData> => {
	return query(collection(firestore, 'games'), orderBy('date')) as Query<
		GamesData,
		DocumentData
	>
}

const gamesByTeamQuery = (
	teamRef: DocumentReference<TeamData, DocumentData> | undefined
): Query<GamesData, DocumentData> | undefined => {
	if (teamRef)
		return query(
			collection(firestore, 'games'),
			or(where('home', '==', teamRef), where('away', '==', teamRef)),
			orderBy('date', 'asc')
		) as Query<GamesData, DocumentData>
	return undefined
}

const updatePlayer = (
	authValue: User | null | undefined,
	data: UpdateData<PlayerDocumentData>
): Promise<void> => {
	return updateDoc(doc(firestore, 'players', authValue!.uid), data)
}

const teamsQuery = (): Query<TeamData, DocumentData> => {
	return query(collection(firestore, 'teams')) as Query<TeamData, DocumentData>
}

const offersForUnrosteredPlayersQuery = (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>
): Query<OfferData, DocumentData> => {
	return query(
		collection(firestore, 'offers'),
		where('player', '==', playerRef),
		where('team', '==', teamRef)
	) as Query<OfferData, DocumentData>
}

const unrosteredPlayersQuery = (): Query<PlayerData, DocumentData> => {
	return query(
		collection(firestore, 'players'),
		where('team', '==', null)
	) as Query<PlayerData, DocumentData>
}

const outgoingOffersQuery = (
	playerSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
): Query<OfferData, DocumentData> | undefined => {
	if (!playerSnapshot) return undefined

	// If the user is a captain, show all the invitations to join their team.
	if (playerSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', playerSnapshot.data()?.team),
			where('creator', '==', 'captain')
		) as Query<OfferData, DocumentData>
	}

	// If the user is a player, show all their requests to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', playerSnapshot?.ref),
		where('creator', '==', 'player')
	) as Query<OfferData, DocumentData>
}

const incomingOffersQuery = (
	playerSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
): Query<OfferData, DocumentData> | undefined => {
	if (!playerSnapshot) return undefined

	// If the user is a captain, show all the requests to join their team.
	if (playerSnapshot.data()?.captain) {
		return query(
			collection(firestore, 'offers'),
			where('team', '==', playerSnapshot.data()?.team),
			where('creator', '==', 'player')
		) as Query<OfferData, DocumentData>
	}

	// If the user is a player, show all their invitations to join teams.
	return query(
		collection(firestore, 'offers'),
		where('player', '==', playerSnapshot.ref),
		where('creator', '==', 'captain')
	) as Query<OfferData, DocumentData>
}

const stripeRegistration = async (
	authValue: User | null | undefined
): Promise<Unsubscribe> => {
	// Create new Checkout Session for the player
	const checkoutSessionRef = (await addDoc(
		collection(firestore, `customers/${authValue?.uid}/checkout_sessions`),
		{
			mode: 'payment',
			price: Products.MinnesotaWinterLeagueRegistration2023Test,
			success_url: window.location.origin,
			cancel_url: window.location.origin,
		}
	)) as DocumentReference<CheckoutSessionData, DocumentData>

	// Listen for the URL of the Checkout Session
	return onSnapshot(checkoutSessionRef, (checkoutSessionSnap) => {
		const data = checkoutSessionSnap.data()
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
	getPlayerSnapshot,
	requestToJoinTeam,
	invitePlayerToJoinTeam,
	teamsQuery,
	gamesQuery,
	outgoingOffersQuery,
	offersForUnrosteredPlayersQuery,
	createPlayer,
	incomingOffersQuery,
	getPlayerRef,
	updatePlayer,
	leaveTeam,
	createTeam,
	deleteTeam,
	stripeRegistration,
	gamesByTeamQuery,
	demoteFromCaptain,
	unrosteredPlayersQuery,
	promoteToCaptain,
	removePlayerFromTeam,
	getStandingsRef,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	type QuerySnapshot,
	type DocumentReference,
	type QueryDocumentSnapshot,
}
