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

	// using name because of route params but should probably figure out a way to use ID instead.
	const lowerCaseNoSpace = (string?: string) =>
		string?.toLowerCase().replace(/ /g, '')
	// especially because it forces me to do dumb stuff like this...
	const teamData = teamsQuerySnapshot?.docs.find(
		(team) => lowerCaseNoSpace(team.data().name) === lowerCaseNoSpace(name)
	)

	const playerList = teamData?.data().roster

	const sampleSchedule = teamsQuerySnapshot?.docs.map((team, index) => {
		return { label: `Week ${index + 1} vs ${team.data().name}` }
	})

	return (
		<div className={'container'}>
			<div className={'w-[250px] my-8 mx-auto'}>
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
								isDisabled={!isCaptain}
								playerRef={playerRef}
							/>
						)
					)}
				</NotificationCard>
				<NotificationCard
					title={'Upcoming games'}
					description={'2023 Minnesota Winter League'}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					<div className="flex flex-col items-end gap-2 py-2">
						{sampleSchedule?.map((x) => (
							<p className="w-full py-2">{x.label}</p>
						))}
					</div>
				</NotificationCard>
			</div>
		</div>
	)
}
