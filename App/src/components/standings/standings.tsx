import { GradientHeader } from '../gradient-header'
import { ComingSoon } from '../coming-soon'
import { useTeamsContext } from '@/contexts/teams-context'
import { useGamesContext } from '@/contexts/games-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useStandings } from '@/lib/use-standings'
import { StandingsTable } from './standings-table'
import { useSeasonsContext } from '@/contexts/seasons-context'
import { formatTimestamp } from '@/lib/utils'

export const Standings = () => {
	const { selectedSeasonTeamsQuerySnapshot } = useTeamsContext()
	const { gamesQuerySnapshot } = useGamesContext()
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const standings = useStandings(gamesQuerySnapshot)

	return (
		<div className="container">
			<GradientHeader>Standings</GradientHeader>
			{!gamesQuerySnapshot ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : Object.keys(standings).length === 0 ? (
				<ComingSoon>
					<p className={' pt-6 '}>
						{`There are no standings to display. Please wait for games to start on ${formatTimestamp(selectedSeasonQueryDocumentSnapshot?.data()?.dateStart)}.`}
					</p>
				</ComingSoon>
			) : (
				<StandingsTable
					standings={standings}
					teamsQuerySnapshot={selectedSeasonTeamsQuerySnapshot}
				/>
			)}
		</div>
	)
}
