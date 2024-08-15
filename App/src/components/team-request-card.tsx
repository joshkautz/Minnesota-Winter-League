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
import { useAuthContext } from '@/firebase/auth-context'
import { toast } from './ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Link } from 'react-router-dom'
import { CheckCircledIcon } from '@radix-ui/react-icons'

export const TeamRequestCard = () => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	if (!authenticatedUserSnapshot) {
		return
	}

	const handleRequest = (
		teamRef: DocumentReference<TeamData, DocumentData>
	) => {
		requestToJoinTeam(authenticatedUserSnapshot?.ref, teamRef)
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
					description: 'Ensure your email is verified. Please try again later.',
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
					playerRef={authenticatedUserSnapshot?.ref}
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
	const {
		authenticatedUserSnapshot,
		authenticatedUserSnapshotLoading,
		authStateLoading,
	} = useAuthContext()

	const team = teamsQuerySnapshot?.docs.find(
		(team) => team.id === authenticatedUserSnapshot?.data()?.team?.id
	)

	const isCaptain = authenticatedUserSnapshot?.data()?.captain

	const registrationStatus =
		authenticatedUserSnapshotLoading || teamsQuerySnapshotLoading ? (
			<p className="text-sm text-muted-foreground">Loading...</p>
		) : !team?.data().registered ? (
			<p className={'text-sm text-muted-foreground'}>
				You need 10 registered players in order to meet the minimum requirement.
				Registration ends Tuesday, October 31st, at 11:59pm.
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

	const titleData = (
		<div className={'inline-flex items-center gap-2 h-4'}>
			<p>{team?.data().name}</p>
			<div className={'h-8 w-8 rounded-full overflow-hidden'}>
				<img className={'object-cover'} src={team?.data().logo} />
			</div>
		</div>
	)

	return (
		<NotificationCard
			title={
				authenticatedUserSnapshotLoading || authStateLoading
					? 'Loading...'
					: titleData
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
