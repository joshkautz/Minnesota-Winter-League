// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import { useCollectionData } from 'react-firebase-hooks/firestore'

// Winter League
import {
	teamsColRef,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'

interface AuthProps {
	collectionDataValue: DocumentData[] | undefined
	collectionDataLoading: boolean
	collectionDataError: FirestoreError | undefined
	collectionDataSnapshot: QuerySnapshot<DocumentData, DocumentData> | undefined
}

const TeamsContext = createContext<AuthProps>({} as AuthProps)

const TeamsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [
		collectionDataValue,
		collectionDataLoading,
		collectionDataError,
		collectionDataSnapshot,
	] = useCollectionData(teamsColRef())

	return (
		<TeamsContext.Provider
			value={{
				collectionDataValue: collectionDataValue,
				collectionDataLoading: collectionDataLoading,
				collectionDataError: collectionDataError,
				collectionDataSnapshot: collectionDataSnapshot,
			}}
		>
			{children}
		</TeamsContext.Provider>
	)
}

export { TeamsContext, TeamsContextProvider }
