import {
	addDoc,
	doc,
	getFirestore,
	DocumentData,
	FirestoreError,
	updateDoc,
	UpdateData,
	getDocs,
	collection,
	QuerySnapshot,
	onSnapshot,
	Unsubscribe,
	DocumentSnapshot,
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
	team: string
}

const firestore = getFirestore(app)

const playerDocRef = (authValue: User | null | undefined) => {
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
	playerDocRef,
	updatePlayerDoc,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	getAllTeams,
	stripeRegistration,
}
