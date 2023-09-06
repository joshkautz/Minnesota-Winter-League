// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	DocumentData,
	FirestoreError,
	QuerySnapshot,
  teamsQuery,
} from '@/firebase/firestore'

interface AuthProps {
	teamsQuerySnapshot: QuerySnapshot<DocumentData, DocumentData> | undefined
	teamsQuerySnapshotLoading: boolean
	teamsQuerySnapshotError: FirestoreError | undefined
}

const TeamsContext = createContext<AuthProps>({} as AuthProps)

const TeamsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	] = useCollection(teamsQuery())

	return (
		<TeamsContext.Provider
			value={{
				teamsQuerySnapshot: teamsQuerySnapshot,
				teamsQuerySnapshotLoading: teamsQuerySnapshotLoading,
				teamsQuerySnapshotError: teamsQuerySnapshotError,
			}}
		>
			{children}
		</TeamsContext.Provider>
	)
}

export { TeamsContext, TeamsContextProvider }
