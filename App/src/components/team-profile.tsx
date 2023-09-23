import { TeamsContext } from '@/firebase/teams-context'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotificationCard } from './notification-card'
import {
	DocumentReference,
	DocumentData,
	gamesByTeamQuery,
} from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'
import { TeamRosterPlayer } from './team-roster-player'
import { AuthContext } from '@/firebase/auth-context'
import { useCollection } from 'react-firebase-hooks/firestore'

export const TeamProfile = () => {
	const { id } = useParams()
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentSnapshot } = useContext(AuthContext)

	const isCaptain = documentSnapshot?.data()?.captain

	const team = id
		? teamsQuerySnapshot?.docs.find((team) => team.id === id)
		: teamsQuerySnapshot?.docs.find(
				(team) => team.id === documentSnapshot?.data()?.team?.id
		  )

	const isOnTeam = team
		?.data()
		.roster.some((player) => player.id === documentSnapshot?.id)

	const [gamesSnapshot] = useCollection(gamesByTeamQuery(team?.ref))

	return (
		<div className={'container'}>
			<div className={'max-h-[250px] w-[250px] my-8 mx-auto'}>
				{team?.data().logo ? (
					<img
						src={team?.data().logo}
						alt={'team logo'}
						className={'object-cover rounded-md'}
					/>
				) : (
					<div className={'text-center text-2xl font-bold'}>
						{'Team Profile'}
					</div>
				)}
			</div>
			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={`${team?.data().name} team players and captains`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					{team
						?.data()
						.roster?.map(
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
					description={'2023 Minneapolis Winter League'}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					<div className="flex flex-col items-end gap-2 py-2">
						{gamesSnapshot?.docs.map((game, index) => {
							const opponent = team?.id == game.data().home.id ? 'away' : 'home'
							return (
								<div
									key={`row-${index}`}
									className="flex items-center justify-between w-full h-8"
								>
									<p className="flex-1 select-none">
										{game.data().date.toDate().toLocaleDateString()}
									</p>
									<p className="flex-1 text-center select-none">
										{game.data().date.toDate() > new Date()
											? 'vs'
											: !game.data().homeScore || !game.data().awayScore
											? 'vs'
											: opponent == 'away'
											? `${game.data().homeScore} - ${game.data().awayScore}`
											: `${game.data().awayScore} - ${game.data().homeScore}`}
									</p>
									<div className="flex-[3]">
										<Link
											className="flex flex-col transition duration-300 group w-max"
											to={
												opponent == 'away'
													? `/teams/${game.data().away.id}`
													: `/teams/${game.data().home.id}`
											}
										>
											{opponent == 'away'
												? teamsQuerySnapshot?.docs
														.find((team) => team.id === game.data().away.id)
														?.data().name
												: teamsQuerySnapshot?.docs
														.find((team) => team.id === game.data().home.id)
														?.data().name}
											<span className="max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</NotificationCard>
			</div>
		</div>
	)
}
