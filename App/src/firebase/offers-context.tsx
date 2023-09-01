// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	outgoingOffersColRef,
	incomingOffersColRef,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'
import { AuthContext } from '@/firebase/auth-context'

interface AuthProps {
	outgoingOffersCollectionDataSnapshot:
		| QuerySnapshot<DocumentData, DocumentData>
		| undefined
	outgoingOffersCollectionDataLoading: boolean
	outgoingOffersCollectionDataError: FirestoreError | undefined

	incomingOffersCollectionDataSnapshot:
		| QuerySnapshot<DocumentData, DocumentData>
		| undefined
	incomingOffersCollectionDataLoading: boolean
	incomingOffersCollectionDataError: FirestoreError | undefined
}

const OffersContext = createContext<AuthProps>({} as AuthProps)

const OffersContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { documentDataSnapshot } = useContext(AuthContext)

	const [
		outgoingOffersCollectionDataSnapshot,
		outgoingOffersCollectionDataLoading,
		outgoingOffersCollectionDataError,
	] = useCollection(outgoingOffersColRef(documentDataSnapshot))

	const [
		incomingOffersCollectionDataSnapshot,
		incomingOffersCollectionDataLoading,
		incomingOffersCollectionDataError,
	] = useCollection(incomingOffersColRef(documentDataSnapshot))

	return (
		<OffersContext.Provider
			value={{
				outgoingOffersCollectionDataSnapshot:
					outgoingOffersCollectionDataSnapshot,
				outgoingOffersCollectionDataLoading:
					outgoingOffersCollectionDataLoading,
				outgoingOffersCollectionDataError: outgoingOffersCollectionDataError,
				incomingOffersCollectionDataSnapshot:
					incomingOffersCollectionDataSnapshot,
				incomingOffersCollectionDataLoading:
					incomingOffersCollectionDataLoading,
				incomingOffersCollectionDataError: incomingOffersCollectionDataError,
			}}
		>
			{children}
		</OffersContext.Provider>
	)
}

export { OffersContext, OffersContextProvider }
