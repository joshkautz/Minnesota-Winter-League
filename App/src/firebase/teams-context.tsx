// React
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	currentSeasonTeamsQuery,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
	teamsQuery,
} from '@/firebase/firestore'
import { TeamData } from '@/lib/interfaces'
import { useSeasonsContext } from './seasons-context'
import { useAuthContext } from './auth-context'

interface TeamProps {
	teamsQuerySnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
	teamsQuerySnapshotLoading: boolean
	teamsQuerySnapshotError: FirestoreError | undefined
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot:
		| QuerySnapshot<TeamData, DocumentData>
		| undefined
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading: boolean
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotError:
		| FirestoreError
		| undefined
}

export const TeamsContext = createContext<TeamProps>({
	teamsQuerySnapshot: undefined,
	teamsQuerySnapshotLoading: false,
	teamsQuerySnapshotError: undefined,
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot: undefined,
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading: false,
	teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotError: undefined,
})

export const useTeamsContext = () => useContext(TeamsContext)

export const TeamsContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const { authenticatedUserSnapshot } = useAuthContext()

	const teamsForWhichAuthenticatedUserIsCaptain = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.filter((season) => season.captain)
				.map((season) => season.team),
		[authenticatedUserSnapshot]
	)

	const [
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	] = useCollection(
		currentSeasonTeamsQuery(selectedSeasonQueryDocumentSnapshot)
	)

	const [
		teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot,
		teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading,
		teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotError,
	] = useCollection(teamsQuery(teamsForWhichAuthenticatedUserIsCaptain))

	return (
		<TeamsContext.Provider
			value={{
				teamsQuerySnapshot,
				teamsQuerySnapshotLoading,
				teamsQuerySnapshotError,
				teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot,
				teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading,
				teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotError,
			}}
		>
			{children}
		</TeamsContext.Provider>
	)
}
