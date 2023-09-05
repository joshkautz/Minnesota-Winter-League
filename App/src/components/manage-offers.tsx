import { ReactNode, useContext, useEffect, useState } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import {
	DocumentReference,
	acceptOffer,
	rejectOffer,
	DocumentData,
	invitePlayerToJoinTeam,
	getPlayerData,
	unrosteredPlayersQuery,
	offersForUnrosteredPlayersQuery,
} from '@/firebase/firestore'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { toast } from './ui/use-toast'
import { TeamsContext } from '@/firebase/teams-context'
import { OfferType, useOffer } from '@/lib/use-offer'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from './ui/card'
import { AuthContext } from '@/firebase/auth-context'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useCollection } from 'react-firebase-hooks/firestore'
import {
	UnrosteredPlayer,
	useUnrosteredPlayers,
} from '@/lib/use-unrostered-players'

// This file is really long and will need to be cleaned up later.
// For now the "/invites" route will render different display panels based on Captain & team status
const NotificationCard = ({
	title,
	description,
	children,
	scrollArea,
}: {
	title: string
	description?: string
	scrollArea?: boolean
	children: ReactNode
}) => {
	return (
		<Card className={''}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			{scrollArea ? (
				<ScrollArea className="h-[600px]">
					<CardContent>{children}</CardContent>
				</ScrollArea>
			) : (
				<CardContent>{children}</CardContent>
			)}
		</Card>
	)
}

interface NotificationCardItemProps {
	data: OfferType | DocumentData
	statusColor?: string
	message?: string
	actionOptions: { title: string; action: (arg: DocumentReference) => void }[]
}
const NotificationCardItem = ({
	data,
	statusColor,
	message,
	actionOptions,
}: NotificationCardItemProps) => {
	const isOfferType = 'creator' in data

	return (
		<div className="flex items-end gap-2 py-2">
			{statusColor && (
				<span
					className={cn(
						'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
						statusColor
					)}
				/>
			)}
			<div className="mr-2">
				<p>
					{isOfferType ? data.playerName : `${data.firstname} ${data.lastname}`}
				</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{isOfferType
						? `${message} ${data.teamName}`
						: `is looking for a team.`}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				{actionOptions.map(({ title, action }, index) => (
					<Button
						key={`action-${index}-${title}`}
						size={'sm'}
						variant={'outline'}
						onClick={() => {
							action(data.ref)
						}}
					>
						{title}
					</Button>
				))}
			</div>
		</div>
	)
}

interface UnrosteredPlayerNotificationCardItemProps {
	unrosteredPlayer: UnrosteredPlayer
	statusColor?: string
	message?: string
	actionOptions: { title: string; action: (arg: DocumentReference) => void }[]
}

const UnrosteredPlayerNotificationCardItem = ({
	unrosteredPlayer,
	statusColor,
	actionOptions,
}: UnrosteredPlayerNotificationCardItemProps) => {
	const { documentDataSnapshot } = useContext(AuthContext)

	const [
		offersForUnrosteredPlayersQuerySnapshot,
		// offersForUnrosteredPlayersQuerySnapshotLoading,
		// offersForUnrosteredPlayersQuerySnapshotError,
	] = useCollection(
		offersForUnrosteredPlayersQuery(
			documentDataSnapshot?.data()?.team,
			unrosteredPlayer.ref
		)
	)

	return (
		<div className="flex items-end gap-2 py-2">
			{statusColor && (
				<span
					className={cn(
						'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
						statusColor
					)}
				/>
			)}
			<div className="mr-2">
				<p>{`${unrosteredPlayer.firstname} ${unrosteredPlayer.lastname}`}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{`is looking for a team.`}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				{actionOptions.map(({ title, action }, index) => (
					<Button
						disabled={
							offersForUnrosteredPlayersQuerySnapshot &&
							offersForUnrosteredPlayersQuerySnapshot.size > 0
						}
						key={`action-${index}-${title}`}
						size={'sm'}
						variant={'outline'}
						onClick={() => {
							action(unrosteredPlayer.ref)
						}}
					>
						{title}
					</Button>
				))}
			</div>
		</div>
	)
}

const TeamInfo = ({ teamData }: { teamData: DocumentData }) => {
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
					onClick={() => console.log('request to join')}
				>
					Join
				</Button>
			</div>
		</div>
	)
}

const PlayerInfo = ({
	playerRef,
	isDisabled,
}: {
	playerRef: DocumentReference
	isDisabled: boolean
}) => {
	const [playerData, setPlayerData] = useState<DocumentData | null | undefined>(
		null
	)

	useEffect(() => {
		async function fetchPlayerData() {
			try {
				const data = await getPlayerData(playerRef)
				setPlayerData(data.data())
			} catch (error) {
				console.error('Error fetching player data:', error)
			}
		}

		fetchPlayerData()
	}, [playerRef])

	return (
		<div>
			{playerData ? (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<p>
							{playerData.firstname} {playerData.lastname}
						</p>
					</div>
					<div className="flex justify-end flex-1 gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size={'sm'} variant={'ghost'}>
									<DotsVerticalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className={'w-56'}>
								<DropdownMenuLabel>More actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>View profile</DropdownMenuItem>
									<DropdownMenuItem disabled={isDisabled}>
										Promote to captain
									</DropdownMenuItem>
									<DropdownMenuItem disabled={isDisabled}>
										Remove from team
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			) : (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<Skeleton className="h-4 w-[250px]" />
					</div>
				</div>
			)}
		</div>
	)
}

export const ManageOffers = () => {
	const { outgoingOffersQuerySnapshot, incomingOffersQuerySnapshot } =
		useContext(OffersContext)
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentDataSnapshot } = useContext(AuthContext)
	const isCaptain = documentDataSnapshot?.data()?.captain
	const isUnrostered = documentDataSnapshot?.data()?.team === null

	const outgoingOffers = useOffer(
		outgoingOffersQuerySnapshot,
		teamsQuerySnapshot
	)
	const incomingOffers = useOffer(
		incomingOffersQuerySnapshot,
		teamsQuerySnapshot
	)

	const [unrosteredPlayersQuerySnapshot] = useCollection(
		isCaptain ? unrosteredPlayersQuery() : undefined
	)

	const unrosteredPlayers = useUnrosteredPlayers(unrosteredPlayersQuerySnapshot)

	const getOfferMessage = (
		num: number | undefined,
		type: 'incoming' | 'outgoing'
	) => {
		const term = type === 'incoming' ? 'request' : 'invite'
		if (!num || num === 0) {
			return `no ${term}s pending at this time.`
		}
		if (num === 1) {
			return `you have one pending ${term}.`
		}
		return `you have ${num} pending ${term}s.`
	}

	const handleCancel = (ref: DocumentReference) => {
		rejectOffer(ref)
			.then(() => {
				toast({
					title: 'Invite Rejected',
					description: 'success',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Unable to reject invite',
					description: 'failure',
					variant: 'destructive',
				})
			})
	}
	const handleAccept = (ref: DocumentReference) => {
		acceptOffer(ref)
			.then(() => {
				toast({
					title: 'Invite accepted',
					description: 'success',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Unable to accept invite',
					description: 'failure',
					variant: 'destructive',
				})
			})
	}

	const handleInvite = async (ref: DocumentReference) => {
		const teamRef = documentDataSnapshot?.data()?.team

		invitePlayerToJoinTeam(ref, teamRef)
			.then(() => {
				toast({
					title: 'Invite sent!',
					description: 'success',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Unable to send invite',
					description: 'failure',
					variant: 'destructive',
				})
			})
	}

	const outgoingPending = outgoingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length
	const incomingPending = incomingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length
	const outgoingActions = [{ title: 'Cancel', action: handleCancel }]
	const incomingActions = [
		{ title: 'Accept', action: handleAccept },
		{ title: 'Reject', action: handleCancel },
	]
	const unrosteredActions = [{ title: 'Invite', action: handleInvite }]

	const teamSnapshot = teamsQuerySnapshot?.docs.find(
		(team) => team.id === documentDataSnapshot?.data()?.team.id
	)

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-max mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Manage Invites
			</div>
			<div className={'flex flex-row justify-center gap-8 flex-wrap-reverse'}>
				{/* LEFT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{/* TEAM LIST IF UNROSTERED */}
					{/* TEAM ROSTER IF ROSTERED */}
					{isUnrostered ? (
						<NotificationCard
							title={'Team list'}
							description={'request to join a team below'}
						>
							{teamsQuerySnapshot?.docs.map((team) => (
								<TeamInfo teamData={team.data()} />
							))}
						</NotificationCard>
					) : (
						<NotificationCard
							title={teamSnapshot?.data()?.name}
							description={'team roster'}
						>
							{teamSnapshot
								?.data()
								.roster.map((playerRef: DocumentReference) => (
									<PlayerInfo isDisabled={!isCaptain} playerRef={playerRef} />
								))}
						</NotificationCard>
					)}
					{/* UNROSTERED PLAYER LIST IF TEAM CAPTAIN */}
					{isCaptain && (
						<NotificationCard
							title={'Unrostered players'}
							description={'players elligible for team roster invitations.'}
							scrollArea
						>
							{unrosteredPlayers &&
								unrosteredPlayers?.map(
									(unrosteredPlayer: UnrosteredPlayer, index) => (
										<UnrosteredPlayerNotificationCardItem
											key={`freeAgent-row-${index}`}
											unrosteredPlayer={unrosteredPlayer}
											actionOptions={unrosteredActions}
										/>
									)
								)}
						</NotificationCard>
					)}
				</div>
				{/* RIGHT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{/* INCOMING OFFERS */}
					<NotificationCard
						title={'Pending requests'}
						description={getOfferMessage(incomingPending, 'incoming')}
					>
						{incomingOffers?.map((incomingOffer: OfferType, index) => {
							const statusColor =
								incomingOffer.status === 'pending'
									? 'bg-primary'
									: 'bg-muted-foreground'
							return (
								<NotificationCardItem
									key={`incomingOffer-row-${index}`}
									data={incomingOffer}
									statusColor={statusColor}
									message={'would like to join'}
									actionOptions={incomingActions}
								/>
							)
						})}
					</NotificationCard>
					{/* OUTGOING OFFERS*/}
					<NotificationCard
						title={'Sent invites'}
						description={getOfferMessage(outgoingPending, 'outgoing')}
					>
						{outgoingOffers?.map((outgoingOffer: OfferType, index) => (
							<NotificationCardItem
								key={`outgoingOffer-row-${index}`}
								data={outgoingOffer}
								statusColor={'bg-muted-foreground'}
								message={'invite sent for'}
								actionOptions={outgoingActions}
							/>
						))}
					</NotificationCard>
				</div>
			</div>
		</div>
	)
}
