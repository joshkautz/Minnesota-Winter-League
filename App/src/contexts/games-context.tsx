// React
import { PropsWithChildren, createContext, useContext } from 'react'

// Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore'

// Winter League
import {
	currentSeasonGamesQuery,
	currentSeasonRegularGamesQuery,
	DocumentData,
	FirestoreError,
	QuerySnapshot,
} from '@/firebase/firestore'
import { GameData } from '@/lib/interfaces'
import { useSeasonsContext } from './seasons-context'

interface GameProps {
	gamesQuerySnapshot: QuerySnapshot<GameData, DocumentData> | undefined
	gamesQuerySnapshotLoading: boolean
	gamesQuerySnapshotError: FirestoreError | undefined
	regularSeasonGamesQuerySnapshot:
		| QuerySnapshot<GameData, DocumentData>
		| undefined
	regularSeasonGamesQuerySnapshotLoading: boolean
	regularSeasonGamesQuerySnapshotError: FirestoreError | undefined
}

export const GamesContext = createContext<GameProps>({
	gamesQuerySnapshot: undefined,
	gamesQuerySnapshotLoading: false,
	gamesQuerySnapshotError: undefined,
	regularSeasonGamesQuerySnapshot: undefined,
	regularSeasonGamesQuerySnapshotLoading: false,
	regularSeasonGamesQuerySnapshotError: undefined,
})

export const useGamesContext = () => useContext(GamesContext)

export const GamesContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const [
		gamesQuerySnapshot,
		gamesQuerySnapshotLoading,
		gamesQuerySnapshotError,
	] = useCollection(
		currentSeasonGamesQuery(selectedSeasonQueryDocumentSnapshot)
	)

	const [
		regularSeasonGamesQuerySnapshot,
		regularSeasonGamesQuerySnapshotLoading,
		regularSeasonGamesQuerySnapshotError,
	] = useCollection(
		currentSeasonRegularGamesQuery(selectedSeasonQueryDocumentSnapshot)
	)

	return (
		<GamesContext.Provider
			value={{
				gamesQuerySnapshot,
				gamesQuerySnapshotLoading,
				gamesQuerySnapshotError,
				regularSeasonGamesQuerySnapshot,
				regularSeasonGamesQuerySnapshotLoading,
				regularSeasonGamesQuerySnapshotError,
			}}
		>
			{children}
		</GamesContext.Provider>
	)
}
