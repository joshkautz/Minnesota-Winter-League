// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollectionData } from 'react-firebase-hooks/firestore'

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
	outgoingOffersCollectionDataValue: DocumentData[] | undefined
	outgoingOffersCollectionDataLoading: boolean
	outgoingOffersCollectionDataError: FirestoreError | undefined
	outgoingOffersCollectionDataSnapshot:
		| QuerySnapshot<DocumentData, DocumentData>
		| undefined
	incomingOffersCollectionDataValue: DocumentData[] | undefined
	incomingOffersCollectionDataLoading: boolean
	incomingOffersCollectionDataError: FirestoreError | undefined
	incomingOffersCollectionDataSnapshot:
		| QuerySnapshot<DocumentData, DocumentData>
		| undefined
}

const OffersContext = createContext<AuthProps>({} as AuthProps)

const OffersContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { documentDataSnapshot } = useContext(AuthContext)

	const [
		outgoingOffersCollectionDataValue,
		outgoingOffersCollectionDataLoading,
		outgoingOffersCollectionDataError,
		outgoingOffersCollectionDataSnapshot,
	] = useCollectionData(outgoingOffersColRef(documentDataSnapshot))

	const [
		incomingOffersCollectionDataValue,
		incomingOffersCollectionDataLoading,
		incomingOffersCollectionDataError,
		incomingOffersCollectionDataSnapshot,
	] = useCollectionData(incomingOffersColRef(documentDataSnapshot))

	return (
		<OffersContext.Provider
			value={{
				outgoingOffersCollectionDataValue: outgoingOffersCollectionDataValue,
				outgoingOffersCollectionDataLoading:
					outgoingOffersCollectionDataLoading,
				outgoingOffersCollectionDataError: outgoingOffersCollectionDataError,
				outgoingOffersCollectionDataSnapshot:
					outgoingOffersCollectionDataSnapshot,
				incomingOffersCollectionDataValue: incomingOffersCollectionDataValue,
				incomingOffersCollectionDataLoading:
					incomingOffersCollectionDataLoading,
				incomingOffersCollectionDataError: incomingOffersCollectionDataError,
				incomingOffersCollectionDataSnapshot:
					incomingOffersCollectionDataSnapshot,
			}}
		>
			{children}
		</OffersContext.Provider>
	)
}

export { OffersContext, OffersContextProvider }
