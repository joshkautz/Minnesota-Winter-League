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
			<CardContent>
				{games.map((game, index) => {
					const homeTeam = teamsQuerySnapshot?.docs
						.find((team) => team.id === game.home.id)
						?.data()
					const awayTeam = teamsQuerySnapshot?.docs
						.find((team) => team.id === game.away.id)
						?.data()
					return (
						<div
							key={`schedule-row-${index}`}
							className={'flex items-center justify-start max-h-10'}
						>
							<div className={'flex-[1]'}>Field {index + 1}</div>
							<div
								className={'flex-[4] flex justify-center gap-4 items-center'}
							>
								<div className={'flex-1'}>
									<img className={'mx-auto max-h-10'} src={homeTeam?.logo} />
								</div>
								<p className={'flex-1  text-center'}>
									{game.date.toDate() > new Date()
										? 'vs'
										: !game.homeScore || !game.awayScore
										? 'vs'
										: `${game.homeScore} - ${game.awayScore}`}
								</p>
								<div className={'items-center flex-1'}>
									<img className={'mx-auto max-h-10'} src={awayTeam?.logo} />
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

	console.log(rounds)
	console.log(rounds.length)

	return (
		<div className="container">
			<div
				className={
					'my-4 mx-auto max-w-max text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300'
				}
			>
				Schedule
			</div>
			{gamesSnapshotLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : (
				<div className={'flex flex-wrap gap-8'}>
					{gamesSnapshotError
						? 'Error'
						: !gamesSnapshot
						? 'No data'
						: rounds.map((games, index) => (
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
