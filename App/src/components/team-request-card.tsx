import {
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	QueryDocumentSnapshot,
	offersForUnrosteredPlayersQuery,
	requestToJoinTeam,
} from '@/firebase/firestore'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { TeamsContext } from '@/firebase/teams-context'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { TeamRosterPlayer } from './team-profile/team-roster-player'
import { useAuthContext } from '@/firebase/auth-context'
import { toast } from './ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Link } from 'react-router-dom'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { useSeasonsContext } from '@/firebase/seasons-context'

export const TeamRequestCard = () => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	const handleRequest = useCallback(
		(
			teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
		) =>
			requestToJoinTeam(authenticatedUserSnapshot, teamQueryDocumentSnapshot)
				?.then(() => {
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
							'Ensure your email is verified. Please try again later.',
						variant: 'destructive',
					})
				}),
		[authenticatedUserSnapshot]
	)

	return (
		<NotificationCard
			title={'Team list'}
			description={'request to join a team below'}
		>
			{teamsQuerySnapshot?.docs.map((teamQueryDocumentSnapshot) => (
				<TeamDetail
					key={teamQueryDocumentSnapshot.id}
					handleRequest={handleRequest}
					teamQueryDocumentSnapshot={teamQueryDocumentSnapshot}
					playerDocumentSnapshot={authenticatedUserSnapshot}
				/>
			))}
		</NotificationCard>
	)
}

const TeamDetail = ({
	handleRequest,
	teamQueryDocumentSnapshot,
	playerDocumentSnapshot,
}: {
	handleRequest: (
		teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
	) => Promise<void> | undefined
	teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
	playerDocumentSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(
			playerDocumentSnapshot,
			teamQueryDocumentSnapshot
		)
	)

	const [creatorSnapshot, creatorSnapshotLoading] = useDocument(
		teamQueryDocumentSnapshot.data().captains[0]
	)
	const isDisabled =
		offersForUnrosteredPlayersQuerySnapshot &&
		offersForUnrosteredPlayersQuerySnapshot.size > 0

	const captainZero = `${creatorSnapshot?.data()?.firstname ?? ''} ${
		creatorSnapshot?.data()?.lastname ?? ''
	}`

	return (
		<div className="flex items-end gap-2 py-2">
			<Link to={`/teams/${teamQueryDocumentSnapshot.id}`}>
				<Avatar>
					<AvatarImage
						src={teamQueryDocumentSnapshot.data().logo ?? undefined}
						alt={'team logo'}
					/>
					<AvatarFallback>
						{teamQueryDocumentSnapshot.data().name?.slice(0, 2) ?? 'NA'}
					</AvatarFallback>
				</Avatar>
			</Link>
			<Link to={`/teams/${teamQueryDocumentSnapshot.id}`}>
				<div className="mr-2">
					<p>{teamQueryDocumentSnapshot.data().name}</p>
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
					onClick={() => handleRequest(teamQueryDocumentSnapshot)}
				>
					Request to join
				</Button>
			</div>
		</div>
	)
}

export const TeamRosterCard = ({ actions }: { actions: ReactNode }) => {
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } =
		useContext(TeamsContext)
	const {
		authenticatedUserSnapshot,
		authenticatedUserSnapshotLoading,
		authStateLoading,
	} = useAuthContext()

	const team = useMemo(
		() =>
			teamsQuerySnapshot?.docs.find(
				(team) =>
					team.id ===
					authenticatedUserSnapshot
						?.data()
						?.seasons.find(
							(item) =>
								item.season.id === selectedSeasonQueryDocumentSnapshot?.id
						)?.team.id
			),
		[
			authenticatedUserSnapshot,
			teamsQuerySnapshot,
			selectedSeasonQueryDocumentSnapshot,
		]
	)

	const isAuthenticatedUserCaptain = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.some(
					(item) =>
						item.season.id === selectedSeasonQueryDocumentSnapshot?.id &&
						item.captain
				),
		[authenticatedUserSnapshot, selectedSeasonQueryDocumentSnapshot]
	)

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
			footerContent={
				isAuthenticatedUserCaptain ? registrationStatus : undefined
			}
		>
			{team?.data().roster.map(
				(
					item: {
						captain: boolean
						player: DocumentReference<PlayerData, DocumentData>
					},
					index: number
				) => <TeamRosterPlayer key={`team-${index}`} playerRef={item.player} />
			)}
		</NotificationCard>
	)
}
