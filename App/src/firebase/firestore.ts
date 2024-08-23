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
	Timestamp,
	Query,
	getCountFromServer,
	documentId,
} from 'firebase/firestore'

import { app } from './app'
import { User } from './auth'
import { Products } from './stripe'
import {
	CheckoutSessionData,
	GameData,
	OfferData,
	PlayerData,
	StandingsData,
	TeamData,
	SeasonData,
	ExtendedPlayerData,
} from '@/lib/interfaces'
import { deleteImage, ref, storage } from './storage'

interface PlayerDocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference<TeamData, DocumentData>
}

enum Collections {
	OFFERS = 'offers',
	GAMES = 'games',
	TEAMS = 'teams',
	SEASONS = 'seasons',
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

const getRegisteredPlayers = async (
	teamRef: DocumentReference<TeamData, DocumentData>
) => {
	const aggregateQuerySnapshot = await getCountFromServer(
		query(
			collection(firestore, 'players'),
			where('team', '==', teamRef),
			where('registered', '==', true)
		)
	)
	return aggregateQuerySnapshot.data().count
}

const createTeam = async (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	name: string,
	logo?: string,
	storagePath?: string
) => {
	const team = await addDoc(collection(firestore, Collections.TEAMS), {
		captains: [playerRef],
		logo: logo ? logo : null,
		name: name,
		registered: false,
		registeredDate: Timestamp.now(),
		roster: [playerRef],
		storagePath: storagePath ? storagePath : null,
	})

	await updateDoc(playerRef, {
		captain: true,
		team: team,
	})

	const offersQuerySnapshot = await getDocs(
		query(
			collection(firestore, Collections.OFFERS),
			where('player', '==', playerRef)
		)
	)

	const offersPromises = offersQuerySnapshot.docs.map(
		(offer: QueryDocumentSnapshot) => deleteDoc(offer.ref)
	)

	return Promise.all(offersPromises)
}

const updateTeam = async (
	teamRef: DocumentReference<TeamData, DocumentData>,
	name?: string,
	logo?: string,
	storagePath?: string
) => {
	const teamDocumentSnapshot = await getDoc(teamRef)

	return updateDoc(teamRef, {
		name: name ? name : teamDocumentSnapshot.data()?.name,
		logo: logo ? logo : teamDocumentSnapshot.data()?.logo,
		storagePath: storagePath
			? storagePath
			: teamDocumentSnapshot.data()?.storagePath,
	})
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

const deleteTeam = async (
	teamRef: DocumentReference<TeamData, DocumentData>,
	setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
) => {
	setLoadingState(true)

	const offersQuerySnapshot = await getDocs(
		query(
			collection(firestore, Collections.OFFERS),
			where('team', '==', teamRef)
		)
	)

	const offersPromises = offersQuerySnapshot.docs.map(
		(offer: QueryDocumentSnapshot) => deleteDoc(offer.ref)
	)

	const playersQuerySnapshot = await getDocs(
		query(collection(firestore, 'players'), where('team', '==', teamRef))
	)

	const playersPromises = playersQuerySnapshot.docs.map(
		(player: QueryDocumentSnapshot) =>
			updateDoc(player.ref, {
				captain: false,
				team: null,
			})
	)

	const teamDocumentSnapshot = await getDoc(teamRef)

	if (teamDocumentSnapshot) {
		const teamDocumentSnapshotData = teamDocumentSnapshot.data()
		if (teamDocumentSnapshotData?.storagePath) {
			await deleteImage(ref(storage, teamDocumentSnapshotData.storagePath))
		}
	}

	await Promise.all([offersPromises, playersPromises, deleteDoc(teamRef)])

	setLoadingState(false)
}

const promoteToCaptain = async (
	playerRef: DocumentReference<PlayerData, DocumentData> | undefined,
	teamRef: DocumentReference<TeamData, DocumentData> | undefined,
	seasonRef: DocumentReference<SeasonData, DocumentData> | undefined
) => {
	if (!playerRef) return
	if (!teamRef) return
	if (!seasonRef) return

	// Get the team doc so we can upate the team document.
	const teamDocumentSnapshot = await getDoc(teamRef)

	// Get the player doc so we can update the player document.
	const playerDocumentSnapshot = await getDoc(playerRef)

	return Promise.all([
		// Update the team doc to add captain status for the player.
		updateDoc(teamRef, {
			roster: teamDocumentSnapshot.data()?.roster.map((item) => ({
				captain: item.player.id === playerRef.id ? true : item.captain,
				player: item.player,
			})),
		}),
		// Updated the player doc to add captain status for the season.
		updateDoc(playerRef, {
			seasons: playerDocumentSnapshot.data()?.seasons.map((item) => ({
				captain: item.season.id === seasonRef.id ? true : item.captain,
				paid: item.paid,
				season: item.season,
				signed: item.signed,
				team: item.team,
			})),
		}),
	])
}

const demoteFromCaptain = async (
	playerRef: DocumentReference<PlayerData, DocumentData> | undefined,
	teamRef: DocumentReference<TeamData, DocumentData> | undefined,
	seasonRef: DocumentReference<SeasonData, DocumentData> | undefined
) => {
	if (!playerRef) return
	if (!teamRef) return
	if (!seasonRef) return

	// Get the team doc so we can update the team document.
	const teamDocumentSnapshot = await getDoc(teamRef)

	// Get the player doc so we can update the player document.
	const playerDocumentSnapshot = await getDoc(playerRef)

	// Check if the player is the last captain on the team. Cannot demote last captain.
	if (
		teamDocumentSnapshot.data()?.roster.filter((item) => item.captain)
			.length === 1
	)
		throw new Error('Cannot demote last captain.')

	return Promise.all([
		// Update the team doc to remove captain status for the player.
		updateDoc(teamRef, {
			roster: teamDocumentSnapshot.data()?.roster.map((item) => ({
				captain: item.player.id === playerRef.id ? false : item.captain,
				player: item.player,
			})),
		}),
		// Updated the player doc to remove captain status for the season.
		updateDoc(playerRef, {
			seasons: playerDocumentSnapshot.data()?.seasons.map((item) => ({
				captain: item.season.id === seasonRef.id ? false : item.captain,
				paid: item.paid,
				season: item.season,
				signed: item.signed,
				team: item.team,
			})),
		}),
	])
}

const leaveTeam = async (
	playerRef: DocumentReference<PlayerData, DocumentData>,
	teamRef: DocumentReference<TeamData, DocumentData>,
	setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
) => {
	setLoadingState(true)
	if ((await getDoc(playerRef)).data()?.captain) {
		if ((await getDoc(teamRef)).data()?.captains.length === 1) {
			setLoadingState(false)
			throw new Error('Cannot remove last captain.')
		}
	}

	await updateDoc(teamRef, {
		captains: arrayRemove(playerRef),
		roster: arrayRemove(playerRef),
	})

	await updateDoc(playerRef, {
		captain: false,
		team: null,
	})

	setLoadingState(false)
}

const invitePlayerToJoinTeam = (
	playerRef: DocumentReference<PlayerData, DocumentData> | undefined,
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
) => {
	if (!playerRef) return
	if (!teamQueryDocumentSnapshot) return
	return addDoc(collection(firestore, Collections.OFFERS), {
		creator: 'captain',
		player: playerRef,
		team: teamQueryDocumentSnapshot.ref,
		status: 'pending',
	})
}

const requestToJoinTeam = (
	playerDocumentSnapshot:
		| DocumentSnapshot<PlayerData, DocumentData>
		| undefined,
	teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
) => {
	if (!playerDocumentSnapshot) return
	return addDoc(collection(firestore, Collections.OFFERS), {
		creator: 'player',
		player: playerDocumentSnapshot.ref,
		team: teamQueryDocumentSnapshot.ref,
		status: 'pending',
	})
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

const standingsQuery = (): Query<StandingsData, DocumentData> => {
	return query(
		collection(firestore, 'standings'),
		orderBy('wins', 'desc'),
		orderBy('differential', 'desc')
	) as Query<StandingsData, DocumentData>
}

const gamesQuery = (): Query<GameData, DocumentData> => {
	return query(
		collection(firestore, Collections.GAMES),
		orderBy('date')
	) as Query<GameData, DocumentData>
}

const currentSeasonGamesQuery = (
	seasonSnapshot: QueryDocumentSnapshot<SeasonData, DocumentData> | undefined
): Query<GameData, DocumentData> | undefined => {
	if (!seasonSnapshot) return undefined

	return query(
		collection(firestore, Collections.GAMES),
		where('season', '==', seasonSnapshot.ref)
	) as Query<GameData, DocumentData>
}

const gamesByTeamQuery = (
	teamRef: DocumentReference<TeamData, DocumentData> | undefined
): Query<GameData, DocumentData> | undefined => {
	if (teamRef)
		return query(
			collection(firestore, Collections.GAMES),
			or(where('home', '==', teamRef), where('away', '==', teamRef)),
			orderBy('date', 'asc')
		) as Query<GameData, DocumentData>
	return undefined
}

const updatePlayer = (
	authValue: User | null | undefined,
	data: UpdateData<PlayerDocumentData>
): Promise<void> => {
	return updateDoc(doc(firestore, 'players', authValue!.uid), data)
}

const getTeamById = (
	id: string | undefined
): DocumentReference<TeamData, DocumentData> | undefined => {
	if (!id) return

	return doc(firestore, Collections.TEAMS, id) as DocumentReference<
		TeamData,
		DocumentData
	>
}

const getTeamByTeamIdAndSeason = (
	teamId: string | undefined,
	seasonRef: DocumentReference<SeasonData, DocumentData> | undefined
): Query<TeamData, DocumentData> | undefined => {
	if (!teamId) return
	if (!seasonRef) return

	return query(
		collection(firestore, Collections.TEAMS),
		where('teamId', '==', teamId),
		where('teamId', '==', seasonRef)
	) as Query<TeamData, DocumentData>
}

const teamsQuery = (
	teams: DocumentReference<TeamData, DocumentData>[] | undefined
): Query<TeamData, DocumentData> | undefined => {
	if (!teams) return
	if (!teams.length) return

	return query(
		collection(firestore, Collections.TEAMS),
		where(documentId(), 'in', teams)
	) as Query<TeamData, DocumentData>
}

const teamsHistoryQuery = (
	id: string | undefined
): Query<TeamData, DocumentData> | undefined => {
	if (!id) return undefined

	return query(
		collection(firestore, Collections.TEAMS),
		where('teamId', '==', id)
	) as Query<TeamData, DocumentData>
}

const currentSeasonTeamsQuery = (
	seasonSnapshot: QueryDocumentSnapshot<SeasonData, DocumentData> | undefined
): Query<TeamData, DocumentData> | undefined => {
	if (!seasonSnapshot) return undefined

	return query(
		collection(firestore, Collections.TEAMS),
		where('season', '==', seasonSnapshot.ref)
	) as Query<TeamData, DocumentData>
}

const seasonsQuery = (): Query<SeasonData, DocumentData> => {
	return query(collection(firestore, Collections.SEASONS)) as Query<
		SeasonData,
		DocumentData
	>
}

const offersForUnrosteredPlayersQuery = (
	playerDocumentSnapshot:
		| DocumentSnapshot<PlayerData, DocumentData>
		| ExtendedPlayerData
		| undefined,
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
) => {
	if (!playerDocumentSnapshot) return
	if (!teamQueryDocumentSnapshot) return
	return query(
		collection(firestore, Collections.OFFERS),
		where('player', '==', playerDocumentSnapshot.ref),
		where('team', '==', teamQueryDocumentSnapshot.ref)
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
			collection(firestore, Collections.OFFERS),
			where('team', '==', playerSnapshot.data()?.team),
			where('creator', '==', 'captain')
		) as Query<OfferData, DocumentData>
	}

	// If the user is a player, show all their requests to join teams.
	return query(
		collection(firestore, Collections.OFFERS),
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
			collection(firestore, Collections.OFFERS),
			where('team', '==', playerSnapshot.data()?.team),
			where('creator', '==', 'player')
		) as Query<OfferData, DocumentData>
	}

	// If the user is a player, show all their invitations to join teams.
	return query(
		collection(firestore, Collections.OFFERS),
		where('player', '==', playerSnapshot.ref),
		where('creator', '==', 'captain')
	) as Query<OfferData, DocumentData>
}

const stripeRegistration = async (
	authValue: User | null | undefined,
	setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
): Promise<Unsubscribe> => {
	setLoadingState(true)

	// Create new Checkout Session for the player
	const checkoutSessionRef = (await addDoc(
		collection(firestore, `customers/${authValue?.uid}/checkout_sessions`),
		{
			mode: 'payment',
			price: Products.WinterLeagueRegistration2024, // TODO: Add to the season update guide. Add a new product for the new season on Stripe, then add its price code to the Products enum in stripe.ts., and then update this line to use the new product.
			success_url: window.location.href,
			cancel_url: window.location.href,
		}
	)) as DocumentReference<CheckoutSessionData, DocumentData>

	// Listen for the URL of the Checkout Session
	return onSnapshot(checkoutSessionRef, (checkoutSessionSnap) => {
		const data = checkoutSessionSnap.data()
		if (data) {
			if (data.url) {
				// We have a Stripe Checkout URL, let's redirect.
				setLoadingState(false)
				window.location.assign(data.url)
			}
		}
	})
}

export {
	teamsHistoryQuery,
	currentSeasonTeamsQuery,
	currentSeasonGamesQuery,
	acceptOffer,
	rejectOffer,
	getPlayerSnapshot,
	requestToJoinTeam,
	invitePlayerToJoinTeam,
	teamsQuery,
	seasonsQuery,
	gamesQuery,
	outgoingOffersQuery,
	offersForUnrosteredPlayersQuery,
	createPlayer,
	incomingOffersQuery,
	getPlayerRef,
	updatePlayer,
	getRegisteredPlayers,
	leaveTeam,
	createTeam,
	deleteTeam,
	updateTeam,
	stripeRegistration,
	gamesByTeamQuery,
	demoteFromCaptain,
	unrosteredPlayersQuery,
	promoteToCaptain,
	standingsQuery,
	getTeamById,
	getTeamByTeamIdAndSeason,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	type QuerySnapshot,
	type DocumentReference,
	type QueryDocumentSnapshot,
}
