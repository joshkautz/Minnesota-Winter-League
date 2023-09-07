// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	outgoingOffersQuery,
	incomingOffersQuery,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'
import { AuthContext } from '@/firebase/auth-context'
import { OfferData } from '@/lib/interfaces'

interface AuthProps {
	outgoingOffersQuerySnapshot:
		| QuerySnapshot<OfferData, DocumentData>
		| undefined
	outgoingOffersQuerySnapshotLoading: boolean
	outgoingOffersQuerySnapshotError: FirestoreError | undefined
	incomingOffersQuerySnapshot:
		| QuerySnapshot<OfferData, DocumentData>
		| undefined
	incomingOffersQuerySnapshotLoading: boolean
	incomingOffersQuerySnapshotError: FirestoreError | undefined
}

const OffersContext = createContext<AuthProps>({} as AuthProps)

const OffersContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { documentSnapshot } = useContext(AuthContext)

	const [
		outgoingOffersQuerySnapshot,
		outgoingOffersQuerySnapshotLoading,
		outgoingOffersQuerySnapshotError,
	] = useCollection(outgoingOffersQuery(documentSnapshot))

	const [
		incomingOffersQuerySnapshot,
		incomingOffersQuerySnapshotLoading,
		incomingOffersQuerySnapshotError,
	] = useCollection(incomingOffersQuery(documentSnapshot))

	console.log(
		incomingOffersQuerySnapshot?.size,
		outgoingOffersQuerySnapshot?.size
	)

	return (
		<OffersContext.Provider
			value={{
				outgoingOffersQuerySnapshot: outgoingOffersQuerySnapshot as
					| QuerySnapshot<OfferData, DocumentData>
					| undefined,
				outgoingOffersQuerySnapshotLoading: outgoingOffersQuerySnapshotLoading,
				outgoingOffersQuerySnapshotError: outgoingOffersQuerySnapshotError,
				incomingOffersQuerySnapshot: incomingOffersQuerySnapshot as
					| QuerySnapshot<OfferData, DocumentData>
					| undefined,
				incomingOffersQuerySnapshotLoading: incomingOffersQuerySnapshotLoading,
				incomingOffersQuerySnapshotError: incomingOffersQuerySnapshotError,
			}}
		>
			{children}
		</OffersContext.Provider>
	)
}

export { OffersContext, OffersContextProvider }
