import { TeamsContext } from '@/firebase/teams-context'
import { toTitleCase } from '@/lib/utils'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
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

	const lowerCaseNoSpace = (string?: string) =>
		string?.toLowerCase().replace(/ /g, '')

	// using name because of route params but should probably figure out a way to use ID instead...
	const teamData = teamsQuerySnapshot?.docs.find(
		(team) => lowerCaseNoSpace(team.data().name) === lowerCaseNoSpace(name)
	)

	const playerList = teamData?.data().roster

	return (
		<div className="container">
			<div className="w-[250px] my-8 mx-auto">
				{teamData?.data().logo ? (
					<img
						src={teamData?.data().logo}
						alt="team logo"
						className="object-cover rounded-md"
					/>
				) : (
					<div className={'text-center text-2xl font-bold'}>
						{toTitleCase(name ?? 'Team Profile')}
					</div>
				)}
			</div>

			<NotificationCard
				title={'Roster'}
				description={`${toTitleCase(name ?? '')} team players and captains`}
			>
				{playerList?.map(
					(
						playerRef: DocumentReference<PlayerData, DocumentData>,
						index: number
					) => (
						<TeamRosterPlayer
							key={`team-${index}`}
							isDisabled={!isCaptain}
							playerRef={playerRef}
						/>
					)
				)}
			</NotificationCard>
		</div>
	)
}
