import {
	DocumentData,
	DocumentReference,
	QueryDocumentSnapshot,
	offersForUnrosteredPlayersQuery,
	requestToJoinTeam,
} from '@/firebase/firestore'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { TeamsContext } from '@/firebase/teams-context'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { ReactNode, useContext } from 'react'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { TeamRosterPlayer } from './team-roster-player'
import { AuthContext } from '@/firebase/auth-context'
import { toast } from './ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Link } from 'react-router-dom'
import { CheckCircledIcon } from '@radix-ui/react-icons'

export const TeamRequestCard = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	if (!documentSnapshot) {
		return
	}

	const handleRequest = (
		teamRef: DocumentReference<TeamData, DocumentData>
	) => {
		requestToJoinTeam(documentSnapshot?.ref, teamRef)
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
			{teamsQuerySnapshot?.docs.map((teamSnapshot) => (
				<TeamDetail
					key={teamSnapshot.id}
					handleRequest={handleRequest}
					teamSnapshot={teamSnapshot}
					playerRef={documentSnapshot?.ref}
				/>
			))}
		</NotificationCard>
	)
}

const TeamDetail = ({
	handleRequest,
	teamSnapshot,
	playerRef,
}: {
	handleRequest: (teamRef: DocumentReference<TeamData, DocumentData>) => void
	teamSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
	playerRef: DocumentReference<PlayerData, DocumentData>
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(playerRef, teamSnapshot.ref)
	)

	// const creatorDoc = getPlayerSnapshot(teamSnapshot.data().captains[0])
	const [creatorSnapshot, creatorSnapshotLoading] = useDocument(
		teamSnapshot.data().captains[0]
	)
	const isDisabled =
		offersForUnrosteredPlayersQuerySnapshot &&
		offersForUnrosteredPlayersQuerySnapshot.size > 0

	const captainZero = `${creatorSnapshot?.data()?.firstname ?? ''} ${
		creatorSnapshot?.data()?.lastname ?? ''
	}`

	return (
		<div className="flex items-end gap-2 py-2">
			<Link to={`/teams/${teamSnapshot.id}`}>
				<Avatar>
					<AvatarImage
						src={teamSnapshot.data().logo ?? undefined}
						alt={'team logo'}
					/>
					<AvatarFallback>
						{teamSnapshot.data().name?.slice(0, 2) ?? 'NA'}
					</AvatarFallback>
				</Avatar>
			</Link>
			<Link to={`/teams/${teamSnapshot.id}`}>
				<div className="mr-2">
					<p>{teamSnapshot.data().name}</p>
					<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
						{creatorSnapshotLoading
							? 'created by...'
							: `created by ${captainZero ?? 'unknown...'}`}
					</p>
				</div>
			</Link>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					size={'sm'}
					variant={'default'}
					disabled={isDisabled}
					onClick={() => handleRequest(teamSnapshot.ref)}
				>
					Request to join
				</Button>
			</div>
		</div>
	)
}

export const TeamRosterCard = ({ actions }: { actions: ReactNode }) => {
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } =
		useContext(TeamsContext)
	const { documentSnapshot, documentSnapshotLoading, authStateLoading } =
		useContext(AuthContext)

	const team = teamsQuerySnapshot?.docs.find(
		(team) => team.id === documentSnapshot?.data()?.team?.id
	)

	const isCaptain = documentSnapshot?.data()?.captain

	const registrationStatus =
		documentSnapshotLoading || teamsQuerySnapshotLoading ? (
			<p className="text-sm text-muted-foreground">Loading...</p>
		) : !team?.data().registered ? (
			<p className={'text-sm text-muted-foreground'}>
				You need 10 registered players in order to meet the minimum requirement.
			</p>
		) : (
			<p
				className={
					'text-sm text-muted-foreground inline-flex gap-2 items-center'
				}
			>
				{team?.data().name} is fully registered
				<CheckCircledIcon className="w-4 h-4" />
			</p>
		)

	return (
		<NotificationCard
			title={
				documentSnapshotLoading || authStateLoading
					? 'Loading...'
					: team?.data().name
			}
			description={'Your team roster'}
			moreActions={actions}
			footerContent={isCaptain ? registrationStatus : undefined}
		>
			{team
				?.data()
				.roster.map(
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
	)
}
