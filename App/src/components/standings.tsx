import { Link } from 'react-router-dom'
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from './ui/table'
import { useMemo } from 'react'
import { GradientHeader } from './gradient-header'
import { ComingSoon } from './coming-soon'
import { cn } from '@/lib/utils'
import { useTeamsContext } from '@/firebase/teams-context'
import { useGamesContext } from '@/firebase/games-context'
import { ReloadIcon } from '@radix-ui/react-icons'

export const Standings = () => {
	const { teamsQuerySnapshot } = useTeamsContext()
	const { gamesQuerySnapshot } = useGamesContext()

	const standings = useMemo(() => {
		const result: {
			[key: string]: {
				pointsFor: number
				pointsAgainst: number
				wins: number
				losses: number
				differential: number
			}
		} = {}

		gamesQuerySnapshot?.docs.forEach((gameQueryDocumentSnapshot) => {
			const home = gameQueryDocumentSnapshot.data().home
			const away = gameQueryDocumentSnapshot.data().away

			result[home.id] = {
				pointsFor:
					(result[home.id] ? result[home.id].pointsFor : 0) +
					gameQueryDocumentSnapshot.data().homeScore,
				pointsAgainst:
					(result[home.id] ? result[home.id].pointsAgainst : 0) +
					gameQueryDocumentSnapshot.data().awayScore,
				differential:
					(result[home.id] ? result[home.id].differential : 0) +
					gameQueryDocumentSnapshot.data().homeScore -
					gameQueryDocumentSnapshot.data().awayScore,
				wins:
					gameQueryDocumentSnapshot.data().homeScore >
					gameQueryDocumentSnapshot.data().awayScore
						? (result[home.id] ? result[home.id].wins : 0) + 1
						: result[home.id]
							? result[home.id].wins
							: 0,
				losses:
					gameQueryDocumentSnapshot.data().homeScore >
					gameQueryDocumentSnapshot.data().awayScore
						? result[home.id]
							? result[home.id].losses
							: 0
						: (result[home.id] ? result[home.id].losses : 0) + 1,
			}

			result[away.id] = {
				pointsFor:
					(result[away.id] ? result[away.id].pointsFor : 0) +
					gameQueryDocumentSnapshot.data().awayScore,
				pointsAgainst:
					(result[away.id] ? result[away.id].pointsAgainst : 0) +
					gameQueryDocumentSnapshot.data().homeScore,
				differential:
					(result[away.id] ? result[away.id].differential : 0) +
					gameQueryDocumentSnapshot.data().awayScore -
					gameQueryDocumentSnapshot.data().homeScore,
				wins:
					gameQueryDocumentSnapshot.data().awayScore >
					gameQueryDocumentSnapshot.data().homeScore
						? (result[away.id] ? result[away.id].wins : 0) + 1
						: result[away.id]
							? result[away.id].wins
							: 0,
				losses:
					gameQueryDocumentSnapshot.data().awayScore >
					gameQueryDocumentSnapshot.data().homeScore
						? result[away.id]
							? result[away.id].losses
							: 0
						: (result[away.id] ? result[away.id].losses : 0) + 1,
			}
		})

		return result
	}, [gamesQuerySnapshot, teamsQuerySnapshot])

	const getColor = (value: number) => {
		if (value > 9) {
			return 'text-green-600'
		}
		if (value < -9) {
			return 'text-destructive'
		}
		return ''
	}

	return (
		<div className="container">
			<GradientHeader>Standings</GradientHeader>
			{!gamesQuerySnapshot ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : Object.keys(standings).length === 0 ? (
				<ComingSoon
					message={
						'There are no standings to display. Please wait for the registration period to end on November 1st, 2024.'
					}
				/>
			) : (
				<Table>
					<TableCaption></TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Team</TableHead>
							<TableHead>W</TableHead>
							<TableHead>L</TableHead>
							<TableHead>+/-</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(standings)
							.sort((a, b) => {
								// Sort by wins
								if (a[1].wins > b[1].wins) {
									return -1
								}
								if (a[1].wins < b[1].wins) {
									return 1
								}

								// Sort by points differential
								if (a[1].differential > b[1].differential) {
									return -1
								}
								if (a[1].differential < b[1].differential) {
									return 1
								}

								return 0
							})
							.map(([key, value], index) => {
								const team = teamsQuerySnapshot?.docs.find(
									(team) => team.id === key
								)
								const teamData = teamsQuerySnapshot?.docs
									.find((team) => team.id === key)
									?.data()
								return (
									<TableRow key={index}>
										<TableCell className="font-medium ">{index + 1}</TableCell>
										<TableCell>
											<Link to={`/teams/${team?.id}`}>
												<div className="flex items-center justify-start gap-2 ">
													<div className="flex justify-start w-16">
														<img
															className={cn(
																'w-8 h-8 rounded-full object-cover bg-muted',
																!teamData?.logo &&
																	'bg-gradient-to-r from-primary to-sky-300'
															)}
															src={teamData?.logo}
														/>
													</div>
													<span>{teamData?.name}</span>
												</div>
											</Link>
										</TableCell>
										<TableCell>{value.wins}</TableCell>
										<TableCell>{value.losses}</TableCell>
										<TableCell
											className={getColor(
												value.pointsFor - value.pointsAgainst
											)}
										>
											{value.pointsFor - value.pointsAgainst}
										</TableCell>
									</TableRow>
								)
							})}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
