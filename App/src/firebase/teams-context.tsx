// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	teamsColRef,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'

interface AuthProps {
	collectionDataSnapshot: QuerySnapshot<DocumentData, DocumentData> | undefined
	collectionDataLoading: boolean
	collectionDataError: FirestoreError | undefined
}

const TeamsContext = createContext<AuthProps>({} as AuthProps)

const TeamsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [
		collectionDataSnapshot,
		collectionDataLoading,
		collectionDataError,
	] = useCollection(teamsColRef())

	return (
		<TeamsContext.Provider
			value={{
				collectionDataSnapshot: collectionDataSnapshot,
				collectionDataLoading: collectionDataLoading,
				collectionDataError: collectionDataError,
			}}
		>
			{children}
		</TeamsContext.Provider>
	)
}

export { TeamsContext, TeamsContextProvider }
