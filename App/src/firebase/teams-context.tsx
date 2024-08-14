// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	currentSeasonTeamsQuery,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'
import { TeamData } from '@/lib/interfaces'
import { useSeasonContext } from './season-context'

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
	const { selectedSeason } = useSeasonContext()

	const [
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	] = useCollection(currentSeasonTeamsQuery(selectedSeason ?? undefined))

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
