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
import { useSeasonsContext } from './seasons-context'

interface TeamProps {
	teamsQuerySnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
	teamsQuerySnapshotLoading: boolean
	teamsQuerySnapshotError: FirestoreError | undefined
}

export const TeamsContext = createContext<TeamProps>({
	teamsQuerySnapshot: undefined,
	teamsQuerySnapshotLoading: false,
	teamsQuerySnapshotError: undefined,
})

export const useTeamsContext = () => useContext(TeamsContext)

export const TeamsContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const [
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	] = useCollection(
		currentSeasonTeamsQuery(selectedSeasonQueryDocumentSnapshot)
	)

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
