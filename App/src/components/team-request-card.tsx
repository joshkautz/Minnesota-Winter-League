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

export const TeamRequestCard = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	if (!documentSnapshot) {
		return
	}

	const userRef = documentSnapshot?.ref

	const handleRequest = (teamRef: DocumentReference) => {
		console.log(userRef, teamRef)
		requestToJoinTeam(userRef, teamRef)
			.then(() => {
				toast({
					title: 'Request sent',
					description: 'you requested to join',
					variant: 'default',
				})
			})
			.catch((error) => {
				console.log(error)
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
					key={team.id}
					handleRequest={handleRequest}
					teamData={team}
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
		offersForUnrosteredPlayersQuery(teamData.ref, userRef)
	)

	const isDisabled =
		offersForUnrosteredPlayersQuerySnapshot &&
		offersForUnrosteredPlayersQuerySnapshot.size > 0

	return (
		<div className="flex items-end gap-2 py-2">
			<Avatar>
				<AvatarImage
					src={teamData.data().logo ?? undefined}
					alt={'team logo'}
				/>
				<AvatarFallback>
					{teamData.data().name?.slice(0, 2) ?? 'NA'}
				</AvatarFallback>
			</Avatar>
			<div className="mr-2">
				<p>{teamData.data().name}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					team details here
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					size={'sm'}
					variant={'default'}
					disabled={isDisabled}
					onClick={() => handleRequest(teamData.ref)}
				>
					Request to join
				</Button>
			</div>
		</div>
	)
}

export const TeamRosterCard = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentSnapshot } = useContext(AuthContext)

	const teamSnapshot = teamsQuerySnapshot?.docs.find(
		(team) => team.id === documentSnapshot?.data()?.team?.id
	)
	const isCaptain = documentSnapshot?.data()?.captain

	return (
		<NotificationCard
			title={teamSnapshot?.data()?.name}
			description={'your team roster'}
		>
			{teamSnapshot
				?.data()
				.roster.map(
					(
						playerRef: DocumentReference<DocumentData, DocumentData>,
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
	)
}
