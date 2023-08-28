import {
	doc,
	getFirestore,
	DocumentData,
	FirestoreError,
	updateDoc,
	UpdateData,
	getDocs,
	collection,
	QuerySnapshot,
} from 'firebase/firestore'

import { app } from './app'
import { User } from './auth'

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

export {
	playerDocRef,
	updatePlayerDoc,
	type DocumentData,
	type FirestoreError,
	getAllTeams,
}
