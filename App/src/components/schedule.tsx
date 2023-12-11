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
import { GamesData, TeamData } from '@/lib/interfaces'
import { ReloadIcon } from '@radix-ui/react-icons'
import { GradientHeader } from './gradient-header'
import { Link } from 'react-router-dom'
import { ComingSoon } from './coming-soon'
import { cn } from '@/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip'

const placeholderPlayoffData = [
	// {
	// 	title: 'Week 5 | Round 1',
	// 	date: 'Saturday, December 9 at 6:05 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'Seed 1', away: 'Seed 8' },
	// 		{ field: 'Field 2', home: 'Seed 4', away: 'Seed 11' },
	// 		{ field: 'Field 3', home: 'Seed 7', away: 'Seed 10' },
	// 	],
	// },
	// {
	// 	title: 'Week 5 | Round 2',
	// 	date: 'Saturday, December 9 at 6:50 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'Seed 1', away: 'Seed 9' },
	// 		{ field: 'Field 2', home: 'Seed 2', away: 'Seed 5' },
	// 		{ field: 'Field 3', home: 'Seed 6', away: 'Seed 11' },
	// 	],
	// },
	// {
	// 	title: 'Week 5 | Round 3',
	// 	date: 'Saturday, December 9 at 7:35 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'Seed 8', away: 'Seed 9' },
	// 		{ field: 'Field 2', home: 'Seed 2', away: 'Seed 12' },
	// 		{ field: 'Field 3', home: 'Seed 3', away: 'Seed 7' },
	// 	],
	// },
	// {
	// 	title: 'Week 5 | Round 4',
	// 	date: 'Saturday, December 9 at 8:20 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'Seed 4', away: 'Seed 6' },
	// 		{ field: 'Field 2', home: 'Seed 5', away: 'Seed 12' },
	// 		{ field: 'Field 3', home: 'Seed 3', away: 'Seed 10' },
	// 	],
	// },

	// {
	// 	title: 'Week 6 | Round 1 | Semifinals',
	// 	date: 'Saturday, December 16 at 6:05 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'P1, 1st', away: 'P4, 1st' },
	// 		{ field: 'Field 2', home: 'P1, 2nd', away: 'P4, 2nd' },
	// 		{ field: 'Field 3', home: 'P1, 3rd', away: 'P4, 3rd' },
	// 	],
	// },
	// {
	// 	title: 'Week 6 | Round 2 | Semifinals',
	// 	date: 'Saturday, December 16 at 6:50 PM',
	// 	content: [
	// 		{ field: 'Field 1', home: 'P2, 1st', away: 'P3, 1st' },
	// 		{ field: 'Field 2', home: 'P2, 2nd', away: 'P3, 2nd' },
	// 		{ field: 'Field 3', home: 'P2, 3rd', away: 'P3, 3rd' },
	// 	],
	// },
	{
		title: 'Week 6 | Round 3 | 3rd, 7th, 11th Finals',
		date: 'Saturday, December 16 at 7:35 PM',
		content: [
			{ field: 'Field 1', home: 'L, F1 R1', away: 'L, F1 R2' },
			{ field: 'Field 2', home: 'L, F2 R1', away: 'L, F2 R2' },
			{ field: 'Field 3', home: 'L, F3 R1', away: 'L, F3 R2' },
		],
	},
	{
		title: 'Week 6 | Round 4 | 1st, 5th, 9th Finals',
		date: 'Saturday, December 16 at 8:20 PM',
		content: [
			{ field: 'Field 1', home: 'W, F1 R1', away: 'W, F1 R2' },
			{ field: 'Field 2', home: 'W, F2 R1', away: 'W, F2 R2' },
			{ field: 'Field 3', home: 'W, F3 R1', away: 'W, F3 R2' },
		],
	},
]

const TeamIcon = ({
	team,
}: {
	team: QueryDocumentSnapshot<TeamData, DocumentData> | undefined
}) => {
	if (!team) {
		return (
			<div
				className={'w-10 h-10 bg-secondary animate-pulse mx-auto rounded-full'}
			/>
		)
	}
	return (
		<Link to={`/teams/${team.id}`}>
			<img
				src={team.data().logo}
				className={cn(
					'mx-auto w-8 h-8 rounded-full object-cover bg-muted hover:scale-105 transition duration-300',
					!team.data().logo && 'bg-gradient-to-r from-primary to-sky-300'
				)}
			/>
		</Link>
	)
}

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
			<CardContent className="flex flex-col gap-2">
				{games
					.sort((a, b) => a.field - b.field)
					.map((game, index) => {
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
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className={'flex-1'}>
													<TeamIcon team={homeTeam} />
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{homeTeam?.data().name}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<p className={'flex-1 select-none text-center'}>
										{game.date.toDate() > new Date()
											? 'vs'
											: game.homeScore === null || game.awayScore === null
											? 'vs'
											: `${game.homeScore} - ${game.awayScore}`}
									</p>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className={'flex-1'}>
													<TeamIcon team={awayTeam} />
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{awayTeam?.data().name}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
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

	console.log(rounds.length)

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
		<div className={'sm:container'}>
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

					{!gamesSnapshotError &&
						placeholderPlayoffData.map((match, index) => (
							<Card
								key={`temp-card-${index}`}
								className="flex-1 flex-shrink-0 basis-80"
							>
								<CardHeader>
									<CardTitle>{match.title}</CardTitle>
									<CardDescription>{match.date}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-2">
									{match.content.map((game, index) => (
										<div
											key={`temp-row-${index}`}
											className={'flex items-center justify-start max-h-10'}
										>
											<div className={'flex-1'}>{game.field}</div>
											<div
												className={
													'flex-[4] flex justify-center gap-4 items-center'
												}
											>
												<div className="flex-1">{game.home}</div>
												<p className={'flex-1 select-none text-center'}>vs</p>
												<div className="flex-1">{game.away}</div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						))}
				</div>
			)}
		</div>
	)
}
