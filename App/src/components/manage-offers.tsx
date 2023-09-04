import { ReactNode, useContext, useEffect, useState } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import {
	DocumentReference,
	acceptOffer,
	rejectOffer,
	unrosteredPlayerList,
	DocumentData,
	invitePlayerToJoinTeam,
	getPlayerData,
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
				<p>{isOfferType ? data.playerName : data.lastname}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{isOfferType
						? `${message} ${data.teamName}`
						: `${data.firstname} would like to join your team.`}
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

const PlayerInfo = ({ playerRef }: { playerRef: DocumentReference }) => {
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
								<DropdownMenuGroup className="cursor-pointer">
									<DropdownMenuItem>View profile</DropdownMenuItem>
									<DropdownMenuItem>Promote to captain</DropdownMenuItem>
									<DropdownMenuItem>Remove from team</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			) : (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<p>loading...</p>
					</div>
				</div>
			)}
		</div>
	)
}

export const ManageOffers = () => {
	const {
		outgoingOffersCollectionDataSnapshot,
		incomingOffersCollectionDataSnapshot,
	} = useContext(OffersContext)
	const { collectionDataSnapshot } = useContext(TeamsContext)
	const { documentDataSnapshot } = useContext(AuthContext)
	const isCaptain = documentDataSnapshot?.data()?.captain
	const isUnrostered = !isCaptain && documentDataSnapshot?.data()?.team === null

	const { offer: outgoingOffers } = useOffer(
		outgoingOffersCollectionDataSnapshot,
		collectionDataSnapshot
	)
	const { offer: incomingOffers } = useOffer(
		incomingOffersCollectionDataSnapshot,
		collectionDataSnapshot
	)

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

	const [unrosteredPlayers, setUnrosteredPlayers] = useState<DocumentData[]>([])

	useEffect(() => {
		const fetchUnrosteredPlayers = async () => {
			try {
				const unrosteredPlayers = await unrosteredPlayerList()
				setUnrosteredPlayers(unrosteredPlayers)
			} catch (error) {
				console.error('Error fetching unrostered players:', error)
			}
		}

		fetchUnrosteredPlayers()
	}, [])

	const teamSnapshot = collectionDataSnapshot?.docs.find(
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
			<div className={'flex flex-row flex-wrap justify-center gap-8'}>
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{isUnrostered ? (
						<div>Teams List</div>
					) : (
						<NotificationCard
							title={teamSnapshot?.data()?.name}
							description={'team roster'}
						>
							{teamSnapshot
								?.data()
								.roster.map((playerRef: DocumentReference) => (
									<PlayerInfo playerRef={playerRef} />
								))}
						</NotificationCard>
					)}
					{isCaptain && (
						<NotificationCard
							title={'Unrostered players'}
							description={'players elligible for team roster invitations.'}
							scrollArea
						>
							{unrosteredPlayers &&
								unrosteredPlayers.map((freeAgent, index) => (
									<NotificationCardItem
										key={`freeAgent-row-${index}`}
										data={freeAgent}
										actionOptions={unrosteredActions}
									/>
								))}
						</NotificationCard>
					)}
				</div>
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
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
					{/* OUTGOING */}
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
