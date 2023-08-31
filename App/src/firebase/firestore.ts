import {
	addDoc,
	doc,
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
	teamsColRef,
	playerDocRef,
	updatePlayerDoc,
	type DocumentData,
	type FirestoreError,
	type DocumentSnapshot,
	type QuerySnapshot,
	stripeRegistration,
}
