// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	DocumentData,
	FirestoreError,
	playersQuery,
	QueryDocumentSnapshot,
	QuerySnapshot,
} from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'
import { useSeasonsContext } from './seasons-context'

interface PlayerProps {
	playersQuerySnapshot: QuerySnapshot<PlayerData, DocumentData> | undefined
	playersQuerySnapshotLoading: boolean
	playersQuerySnapshotError: FirestoreError | undefined
	unrosteredPlayerQuerySnapshots:
		| QueryDocumentSnapshot<PlayerData, DocumentData>[]
		| undefined
}

export const PlayersContext = createContext<PlayerProps>({
	playersQuerySnapshot: undefined,
	playersQuerySnapshotLoading: false,
	playersQuerySnapshotError: undefined,
	unrosteredPlayerQuerySnapshots: undefined,
})

export const usePlayersContext = () => useContext(PlayersContext)

export const PlayersContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { currentSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const [
		playersQuerySnapshot,
		playersQuerySnapshotLoading,
		playersQuerySnapshotError,
	] = useCollection(playersQuery())

	const unrosteredPlayerQuerySnapshots = playersQuerySnapshot?.docs.filter(
		(player) =>
			player
				.data()
				.seasons.some(
					(season) =>
						season.season.id === currentSeasonQueryDocumentSnapshot?.id &&
						!season.team
				)
	)

	return (
		<PlayersContext.Provider
			value={{
				playersQuerySnapshot,
				playersQuerySnapshotLoading,
				playersQuerySnapshotError,
				unrosteredPlayerQuerySnapshots,
			}}
		>
			{children}
		</PlayersContext.Provider>
	)
}
