import { GradientHeader } from '../gradient-header'
import { ComingSoon } from '../coming-soon'
import { useTeamsContext } from '@/firebase/teams-context'
import { useGamesContext } from '@/firebase/games-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useStandings } from '@/lib/use-standings'
import { StandingsTable } from './standings-table'

export const Standings = () => {
	const { teamsQuerySnapshot } = useTeamsContext()
	const { gamesQuerySnapshot } = useGamesContext()

	const standings = useStandings(gamesQuerySnapshot)

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
				<StandingsTable
					standings={standings}
					teamsQuerySnapshot={teamsQuerySnapshot}
				/>
			)}
		</div>
	)
}
