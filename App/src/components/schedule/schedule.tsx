import { useMemo } from 'react'
import { DocumentData, QueryDocumentSnapshot } from '@/firebase/firestore'
import { GameData } from '@/lib/interfaces'
import { ReloadIcon } from '@radix-ui/react-icons'
import { GradientHeader } from '../gradient-header'
import { ComingSoon } from '../coming-soon'
import { Timestamp } from '@firebase/firestore'
import { useGamesContext } from '@/firebase/games-context'
import { ScheduleCard } from './schedule-card'
import { useSeasonsContext } from '@/firebase/seasons-context'

const formatTimestamp = (timestamp: Timestamp | undefined) => {
	if (!timestamp) return
	const date = new Date(timestamp.seconds * 1000)
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

export const Schedule = () => {
	const { gamesQuerySnapshot } = useGamesContext()
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const rounds: GameData[][] = useMemo(() => {
		const result: GameData[][] = []
		let index: number = 0
		let previousTimestamp: number = 0
		gamesQuerySnapshot?.docs
			.sort((a, b) => a.data().date.seconds - b.data().date.seconds)
			.forEach(
				(
					queryDocumentSnapshot: QueryDocumentSnapshot<GameData, DocumentData>
				) => {
					const currentTimestamp = queryDocumentSnapshot.data().date.seconds
					if (previousTimestamp == 0) {
						previousTimestamp = currentTimestamp
					}
					if (previousTimestamp !== currentTimestamp) {
						previousTimestamp = currentTimestamp
						index++
					}
					if (!result[index]) {
						result[index] = []
					}
					result[index].push(queryDocumentSnapshot.data())
				}
			)
		return result
	}, [gamesQuerySnapshot])

	return (
		<div className={'sm:container'}>
			<GradientHeader>Schedule</GradientHeader>

			{!gamesQuerySnapshot ? (
				<div className={'absolute inset-0 flex items-center justify-center'}>
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : gamesQuerySnapshot.docs.length == 0 ? (
				<div className={'flex flex-wrap gap-8'}>
					<ComingSoon>
						<p className={' pt-6 '}>
							{`There is no schedule to display. Please wait for registration to end on ${formatTimestamp(selectedSeasonQueryDocumentSnapshot?.data()?.registrationEnd)}.`}
						</p>
					</ComingSoon>
				</div>
			) : (
				<div className={'flex flex-wrap gap-8'}>
					{rounds.map((games, index) => (
						<ScheduleCard
							key={`schedule-card-${index}`}
							games={games}
							title={`Week ${Math.ceil((index + 1) / 4)} | Round ${
								(index % 4) + 1
							}`}
						/>
					))}
				</div>
			)}
		</div>
	)
}
