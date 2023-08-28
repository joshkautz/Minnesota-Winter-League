import {
	doc,
	getFirestore,
	DocumentData,
	FirestoreError,
	updateDoc,
	UpdateData,
	getDocs,
	collection,
	where,
	query,
	QuerySnapshot,
	getDoc,
} from 'firebase/firestore'

import { app } from './app'
import { User } from './auth'
import { OfferType } from '@/hooks/use-offers'

interface UserDocumentData {
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: string
}

const firestore = getFirestore(app)

const userDocRef = (authValue: User | null | undefined) => {
	return authValue ? doc(firestore, 'users', authValue.uid) : undefined
}

const updateUserDoc = async (
	authValue: User | null | undefined,
	data: UpdateData<UserDocumentData>
) => {
	return authValue
		? updateDoc(doc(firestore, 'users', authValue.uid), data)
		: undefined
}

const getAllTeams = async (): Promise<DocumentData[]> => {
	try {
		const teamsCollectionRef = collection(firestore, 'teams')
		const querySnapshot: QuerySnapshot = await getDocs(teamsCollectionRef)
		const teamsData: DocumentData[] = []

		querySnapshot.forEach((doc) => {
			teamsData.push({ id: doc.id, ...doc.data() })
		})

		return teamsData
	} catch (error) {
		console.error('Error fetching teams:', error)
		throw error
	}
}

const getOfferTeamAndPlayerData = async (
	userRef: User | null | undefined,
	firestoreValue: DocumentData | undefined
) => {
	const offers: OfferType[] = []

	if (!userRef || !firestoreValue) {
		// no offers for unauthenticated
		return offers
	}

	const { captain, team } = firestoreValue

	if (!captain && team) {
		// no offers for rostered players
		return offers
	}

	try {
		const offersRef = collection(firestore, 'offers')
		const captainFilter = where('team', '==', team)
		const playerFilter = where('player', '==', userRef)

		const q = query(
			offersRef,
			captain ? captainFilter : playerFilter,
			where('status', '==', 'pending')
		)

		const offersSnapshot: QuerySnapshot<DocumentData> = await getDocs(q)

		const offersWithPlayerAndTeamData = await Promise.all(
			offersSnapshot.docs.map(async (offerDoc) => {
				const offerData = offerDoc.data()

				const playerDocRef = doc(firestore, 'users', offerData.player.id)
				const teamDocRef = doc(firestore, 'teams', offerData.team.id)
				const playerSnapshot = await getDoc(playerDocRef)
				const teamSnapshot = await getDoc(teamDocRef)
				const playerData = playerSnapshot.data()
				const teamData = teamSnapshot.data()

				return {
					offer: offerData,
					player: playerData,
					team: teamData,
				}
			})
		)

		return offersWithPlayerAndTeamData
	} catch (error) {
		console.error('Error fetching offer data:', error)
		throw error
	}
}

export {
	userDocRef,
	updateUserDoc,
	type DocumentData,
	type FirestoreError,
	getAllTeams,
	getOfferTeamAndPlayerData,
}
