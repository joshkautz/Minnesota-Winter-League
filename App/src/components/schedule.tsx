import { useContext } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import { TeamsContext } from '@/firebase/teams-context'
import { useCollection } from 'react-firebase-hooks/firestore'
import {
	DocumentData,
	QueryDocumentSnapshot,
	gamesQuery,
} from '@/firebase/firestore'
import { GamesData } from '@/lib/interfaces'
import { ReloadIcon } from '@radix-ui/react-icons'
import { GradientHeader } from './gradient-header'
import { Link } from 'react-router-dom'
import { ComingSoon } from './coming-soon'

const ScheduleCard = ({
	games,
	title,
}: {
	games: GamesData[]
	title: string
}) => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	return (
		<Card className={'flex-1 flex-shrink-0 basis-80'}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>
					{games[0].date.toDate().toLocaleString(undefined, {
						weekday: 'long', // Full weekday name
						month: 'long', // Full month name
						day: 'numeric', // Day of the month
						hour: 'numeric', // Hour (1-12)
						minute: '2-digit', // Minute (2-digit)
						hour12: true, // Use 12-hour clock format (AM/PM)
					})}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				{games.map((game, index) => {
					const homeTeam = teamsQuerySnapshot?.docs.find(
						(team) => team.id === game.home.id
					)

					const awayTeam = teamsQuerySnapshot?.docs.find(
						(team) => team.id === game.away.id
					)

					return (
						<div
							key={`schedule-row-${index}`}
							className={'flex items-center justify-start max-h-10'}
						>
							<div className={'flex-1'}>Field {index + 1}</div>
							<div
								className={'flex-[4] flex justify-center gap-4 items-center'}
							>
								<div className={'flex-1'}>
									<Link to={`/teams/${homeTeam?.id}`}>
										<img
											className={'mx-auto max-h-10'}
											src={homeTeam?.data().logo}
										/>
									</Link>
								</div>
								<p className={'flex-1  text-center'}>
									{game.date.toDate() > new Date()
										? 'vs'
										: game.homeScore === null || game.awayScore === null
										? 'vs'
										: `${game.homeScore} - ${game.awayScore}`}
								</p>
								<div className={'items-center flex-1'}>
									<Link to={`/teams/${awayTeam?.id}`}>
										<img
											className={'mx-auto max-h-10'}
											src={awayTeam?.data().logo}
										/>
									</Link>
								</div>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}

export const Schedule = () => {
	const [gamesSnapshot, gamesSnapshotLoading, gamesSnapshotError] =
		useCollection(gamesQuery())

	const rounds: GamesData[][] = []
	let previous: number = 0
	let index: number = 0

	gamesSnapshot?.docs.forEach(
		(queryDocumentSnapshot: QueryDocumentSnapshot<GamesData, DocumentData>) => {
			const time = queryDocumentSnapshot.data().date.toDate().getTime()
			if (previous == 0) {
				previous = time
			}
			if (previous !== time) {
				previous = time
				index++
			}
			if (!rounds[index]) {
				rounds[index] = []
			}
			rounds[index].push(queryDocumentSnapshot.data())
		}
	)

	return (
		<div className={'container'}>
			<GradientHeader>Schedule</GradientHeader>

			{gamesSnapshotLoading ? (
				<div className={'absolute inset-0 flex items-center justify-center'}>
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : (
				<div className={'flex flex-wrap gap-8'}>
					{gamesSnapshotError ? (
						'Error'
					) : !gamesSnapshot || rounds.length === 0 ? (
						<ComingSoon
							message={
								'Full schedule details will be posted once the registration period ends. Minnesota Winter League 2023 games take place from November 4th through December 16th.'
							}
						/>
					) : (
						rounds.map((games, index) => (
							<ScheduleCard
								key={`schedule-card-${index}`}
								games={games}
								title={`Week ${Math.ceil((index + 1) / 4)} | Round ${
									(index % 4) + 1
								}`}
							/>
						))
					)}
				</div>
			)}
		</div>
	)
}
