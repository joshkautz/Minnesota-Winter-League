import {
	doc,
	getFirestore,
	DocumentData,
	FirestoreError,
	updateDoc,
	UpdateData,
} from 'firebase/firestore'

import { app } from './app.ts'
import { User } from './auth.ts'

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

export { userDocRef, updateUserDoc, type DocumentData, type FirestoreError }
