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

export {
	userDocRef,
	updateUserDoc,
	type DocumentData,
	type FirestoreError,
	getAllTeams,
}
