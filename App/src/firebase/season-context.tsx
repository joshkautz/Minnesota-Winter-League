import { useCollection } from 'react-firebase-hooks/firestore'
import {
	DocumentData,
	QuerySnapshot,
	seasonsQuery,
	FirestoreError,
	QueryDocumentSnapshot,
} from '@/firebase/firestore'
import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { SeasonData } from '@/lib/interfaces'

interface SeasonProps {
	seasonsQuerySnapshot: QuerySnapshot<SeasonData, DocumentData> | undefined
	seasonsQuerySnapshotLoading: boolean
	seasonsQuerySnapshotError: FirestoreError | undefined
	selectedSeason: QueryDocumentSnapshot<SeasonData, DocumentData> | undefined
	setSelectedSeason: Dispatch<
		SetStateAction<QueryDocumentSnapshot<SeasonData, DocumentData> | undefined>
	>
}

export const SeasonsContext = createContext<SeasonProps>({
	seasonsQuerySnapshot: undefined,
	seasonsQuerySnapshotLoading: false,
	seasonsQuerySnapshotError: undefined,
	selectedSeason: undefined,
	setSelectedSeason: () => {},
})

export const useSeasonContext = () => useContext(SeasonsContext)

export const SeasonsContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [
		seasonsQuerySnapshot,
		seasonsQuerySnapshotLoading,
		seasonsQuerySnapshotError,
	] = useCollection(seasonsQuery())

	const [selectedSeason, setSelectedSeason] = useState<
		QueryDocumentSnapshot<SeasonData, DocumentData> | undefined
	>(undefined)

	const getMostRecentSeason = useCallback(() => {
		return seasonsQuerySnapshot?.docs.sort(
			(a, b) => a.data().dateStart.seconds - b.data().dateStart.seconds
		)[0]
	}, [seasonsQuerySnapshot])

	useEffect(() => {
		setSelectedSeason(getMostRecentSeason())
	}, [setSelectedSeason, getMostRecentSeason])

	return (
		<SeasonsContext.Provider
			value={{
				seasonsQuerySnapshot,
				seasonsQuerySnapshotLoading,
				seasonsQuerySnapshotError,
				selectedSeason,
				setSelectedSeason,
			}}
		>
			{children}
		</SeasonsContext.Provider>
	)
}
