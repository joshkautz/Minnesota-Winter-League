import {
	DocumentData,
	DocumentReference,
	offersForUnrosteredPlayersQuery,
	requestToJoinTeam,
} from '@/firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { TeamsContext } from '@/firebase/teams-context'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useContext } from 'react'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { TeamRosterPlayer } from './team-roster-player'
import { AuthContext } from '@/firebase/auth-context'
import { toast } from './ui/use-toast'

export const TeamRequestCard = ({
	userRef,
}: {
	userRef: DocumentReference
}) => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	const handleRequest = (teamRef: DocumentReference) => {
		requestToJoinTeam(userRef, teamRef)
			.then(() => {
				toast({
					title: 'Request sent',
					description: 'you requested to join',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Unable to send request',
					description:
						'Something went wrong on our end. Please try again later.',
					variant: 'destructive',
				})
			})
	}

	return (
		<NotificationCard
			title={'Team list'}
			description={'request to join a team below'}
		>
			{teamsQuerySnapshot?.docs.map((team) => (
				<TeamDetail
					handleRequest={handleRequest}
					teamData={team.data()}
					userRef={userRef}
				/>
			))}
		</NotificationCard>
	)
}

const TeamDetail = ({
	handleRequest,
	teamData,
	userRef,
}: {
	handleRequest: (teamRef: DocumentReference) => void
	teamData: DocumentData
	userRef: DocumentReference
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(teamData.team, userRef)
	)

	const isDisabled =
		offersForUnrosteredPlayersQuerySnapshot &&
		offersForUnrosteredPlayersQuerySnapshot.size > 0

	return (
		<div className="flex items-end gap-2 py-2">
			<Avatar>
				<AvatarImage src={teamData.logo ?? undefined} alt={'team logo'} />
				<AvatarFallback>{teamData.name?.slice(0, 2) ?? 'NA'}</AvatarFallback>
			</Avatar>
			<div className="mr-2">
				<p>{teamData.name}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					team details here
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					size={'sm'}
					variant={'default'}
					disabled={isDisabled}
					onClick={() => handleRequest(teamData.team)}
				>
					Request to join
				</Button>
			</div>
		</div>
	)
}

export const TeamRosterCard = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentDataSnapshot } = useContext(AuthContext)

	const teamSnapshot = teamsQuerySnapshot?.docs.find(
		(team) => team.id === documentDataSnapshot?.data()?.team?.id
	)
	const isCaptain = documentDataSnapshot?.data()?.captain

	return (
		<NotificationCard
			title={teamSnapshot?.data()?.name}
			description={'your team roster'}
		>
			{teamSnapshot
				?.data()
				.roster.map((playerRef: DocumentReference) => (
					<TeamRosterPlayer isDisabled={!isCaptain} playerRef={playerRef} />
				))}
		</NotificationCard>
	)
}
