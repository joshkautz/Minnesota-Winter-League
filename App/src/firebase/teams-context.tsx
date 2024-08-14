// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	DocumentData,
	FirestoreError,
	QuerySnapshot,
	teamsQuery,
} from '@/firebase/firestore'
import { TeamData } from '@/lib/interfaces'

interface TeamProps {
	teamsQuerySnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
	teamsQuerySnapshotLoading: boolean
	teamsQuerySnapshotError: FirestoreError | undefined
}

const TeamsContext = createContext<TeamProps>({
	teamsQuerySnapshot: undefined,
	teamsQuerySnapshotLoading: false,
	teamsQuerySnapshotError: undefined,
})

export const useTeamsContext = () => useContext(TeamsContext)

const TeamsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	] = useCollection(teamsQuery())

	return (
		<TeamsContext.Provider
			value={{
				teamsQuerySnapshot,
				teamsQuerySnapshotLoading,
				teamsQuerySnapshotError,
			}}
		>
			{children}
		</TeamsContext.Provider>
	)
}

export { TeamsContext, TeamsContextProvider }
