import { TeamsContext } from '@/firebase/teams-context'
import { toCamelCase, toTitleCase } from '@/lib/utils'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotificationCard } from './notification-card'
import { DocumentReference, DocumentData } from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'
import { TeamRosterPlayer } from './team-roster-player'
import { AuthContext } from '@/firebase/auth-context'

export const TeamProfile = () => {
	const { name } = useParams()
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentSnapshot } = useContext(AuthContext)

	const isCaptain = documentSnapshot?.data()?.captain

	// using name because of route params but should probably figure out a way to use ID instead.
	const lowerCaseNoSpace = (string?: string) =>
		string?.toLowerCase().replace(/ /g, '')
	// especially because it forces me to do dumb stuff like this...
	const teamData = teamsQuerySnapshot?.docs.find(
		(team) => lowerCaseNoSpace(team.data().name) === lowerCaseNoSpace(name)
	)
	const isOnTeam = teamData
		?.data()
		.roster.some((player) => player.id === documentSnapshot?.id)

	const playerList = teamData?.data().roster

	const sampleSchedule = teamsQuerySnapshot?.docs
		.map((team) => {
			return {
				date: 'Week',
				score: '-',
				opponent: team.data().name,
			}
		})
		.filter((game) => game.opponent !== teamData?.data().name)

	return (
		<div className={'container'}>
			<div className={'max-h-[250px] w-[250px] my-8 mx-auto'}>
				{teamData?.data().logo ? (
					<img
						src={teamData?.data().logo}
						alt={'team logo'}
						className={'object-cover rounded-md'}
					/>
				) : (
					<div className={'text-center text-2xl font-bold'}>
						{toTitleCase(name ?? 'Team Profile')}
					</div>
				)}
			</div>
			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={`${toTitleCase(name ?? '')} team players and captains`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					{playerList?.map(
						(
							playerRef: DocumentReference<PlayerData, DocumentData>,
							index: number
						) => (
							<TeamRosterPlayer
								key={`team-${index}`}
								isDisabled={!isOnTeam || !isCaptain}
								playerRef={playerRef}
							/>
						)
					)}
				</NotificationCard>
				<NotificationCard
					title={'Record'}
					description={'2023 Minnesota Winter League'}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					<div className="flex flex-col items-end gap-2 py-2">
						{sampleSchedule?.map((row, index) => (
							<div
								key={`row-${index}`}
								className="flex items-center justify-between w-full h-8"
							>
								<p className="flex-1">
									{row.date} {index + 1}
								</p>
								<p className="flex-1 text-center">{row.score}</p>
								<div className="flex-[3]">
									<Link
										className="flex flex-col transition duration-300 group w-max"
										to={`/teams/${toCamelCase(row.opponent)}`}
									>
										{row.opponent}
										<span className="max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
									</Link>
								</div>
							</div>
						))}
					</div>
				</NotificationCard>
			</div>
		</div>
	)
}
