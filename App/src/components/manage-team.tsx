import { useContext, useState } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import {
	DocumentData,
	DocumentReference,
	acceptOffer,
	deleteTeam,
	leaveTeam,
	rejectOffer,
} from '@/firebase/firestore'
import { toast } from './ui/use-toast'
import { useOffer } from '@/lib/use-offer'
import { AuthContext } from '@/firebase/auth-context'
import { NotificationCard, NotificationCardItem } from './notification-card'
import { TeamRequestCard, TeamRosterCard } from './team-request-card'
import { UnrosteredPlayerList } from './unrostered-player-card'
import { TeamsContext } from '@/firebase/teams-context'
import { ExtendedOfferData, OfferData } from '@/lib/interfaces'
import { Button } from './ui/button'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { DestructiveConfirmationDialog } from './destructive-confirmation-dialog'
import { useNavigate } from 'react-router-dom'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { GradientHeader } from './gradient-header'

export const ManageTeam = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { outgoingOffersQuerySnapshot, incomingOffersQuerySnapshot } =
		useContext(OffersContext)
	const { authStateLoading, documentSnapshot, documentSnapshotLoading } =
		useContext(AuthContext)
	const navigate = useNavigate()
	const isCaptain = documentSnapshot?.data()?.captain
	const isUnrostered = documentSnapshot?.data()?.team === null

	const [deleteTeamLoading, setDeleteTeamLoading] = useState(false)
	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)

	const outgoingOffers = useOffer(
		outgoingOffersQuerySnapshot,
		teamsQuerySnapshot
	)
	const incomingOffers = useOffer(
		incomingOffersQuerySnapshot,
		teamsQuerySnapshot
	)

	const getOfferMessage = (
		isCaptain: boolean | undefined,
		num: number | undefined,
		type: 'incoming' | 'outgoing'
	) => {
		if (isCaptain) {
			const term = type === 'incoming' ? 'request' : 'invite'
			if (!num || num === 0) {
				return `no ${term}s pending at this time.`
			}
			if (num === 1) {
				return `you have one pending ${term}.`
			}
			return `you have ${num} pending ${term}s.`
		}

		const term = type === 'incoming' ? 'invite' : 'request'
		if (!num || num === 0) {
			return `no ${term}s pending at this time.`
		}
		if (num === 1) {
			return `you have one pending ${term}.`
		}
		return `you have ${num} pending ${term}s.`
	}

	const handleReject = (
		offerRef: DocumentReference<OfferData, DocumentData>
	) => {
		rejectOffer(offerRef)
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

	const handleAccept = (
		offerRef: DocumentReference<OfferData, DocumentData>
	) => {
		acceptOffer(offerRef)
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

	const outgoingPending = outgoingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length
	const incomingPending = incomingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length

	const outgoingActions = [{ title: 'Cancel', action: handleReject }]
	const incomingActions = [
		{ title: 'Accept', action: handleAccept },
		{ title: 'Reject', action: handleReject },
	]

	const captainActions = (
		<div className="absolute right-6 top-6">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size={'sm'} variant={'ghost'}>
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						<DestructiveConfirmationDialog
							title={'Are you sure you want to leave?'}
							description={
								'You will not be able to rejoin unless a captain accepts you back on to the roster.'
							}
							onConfirm={() => {
								if (documentSnapshot) {
									const documentSnapshotData = documentSnapshot.data()
									if (documentSnapshotData) {
										leaveTeam(
											documentSnapshot.ref,
											documentSnapshotData.team,
											setLeaveTeamLoading
										)
									}
								}
							}}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								disabled={leaveTeamLoading}
								onClick={(event) => event.preventDefault()}
							>
								Leave Team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>

						<DestructiveConfirmationDialog
							title={'Are you sure?'}
							description={
								'The entire team will be deleted. This action is irreversible.'
							}
							onConfirm={() => {
								if (documentSnapshot) {
									const documentSnapshotData = documentSnapshot.data()
									if (documentSnapshotData) {
										deleteTeam(documentSnapshotData.team, setDeleteTeamLoading)
											.then(() => {
												navigate('/')
											})
											.catch(() => {
												toast({
													title: 'Unable to delete team',
													description:
														'Something went wrong. Please try again later.',
													variant: 'destructive',
												})
											})
									}
								}
							}}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								disabled={deleteTeamLoading}
								onClick={(event) => event.preventDefault()}
							>
								Delete Team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)

	const playerActions = (
		<div className="absolute right-6 top-6">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size={'sm'} variant={'ghost'}>
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						<DestructiveConfirmationDialog
							title={'Are you sure you want to leave?'}
							description={
								'You will not be able to rejoin unless a captain accepts you back on to the roster.'
							}
							onConfirm={() => {
								if (documentSnapshot) {
									const documentSnapshotData = documentSnapshot.data()
									if (documentSnapshotData) {
										leaveTeam(
											documentSnapshot.ref,
											documentSnapshotData.team,
											setLeaveTeamLoading
										)
									}
								}
							}}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								disabled={leaveTeamLoading}
								onClick={(event) => event.preventDefault()}
							>
								Leave Team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)

	return (
		<div className={'container'}>
			<GradientHeader>
				{documentSnapshotLoading ||
				authStateLoading ||
				documentSnapshot?.data()?.team === undefined
					? `Loading...`
					: documentSnapshot?.data()?.team === null
					? `Join Team`
					: `Manage Team`}
			</GradientHeader>
			<div className={'flex flex-row justify-center gap-8 flex-wrap-reverse'}>
				{/* LEFT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{isUnrostered ? (
						<TeamRequestCard />
					) : (
						<TeamRosterCard
							actions={isCaptain ? captainActions : playerActions}
						/>
					)}
					{isCaptain && <UnrosteredPlayerList />}
				</div>
				{/* RIGHT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{/* INCOMING OFFERS */}
					<NotificationCard
						title={isCaptain ? 'Pending requests' : 'Pending invites'}
						description={getOfferMessage(
							isCaptain,
							incomingPending,
							'incoming'
						)}
					>
						{incomingOffers?.map((incomingOffer: ExtendedOfferData, index) => {
							const statusColor =
								incomingOffer.status === 'pending'
									? 'bg-primary'
									: 'bg-muted-foreground'
							return (
								<NotificationCardItem
									key={`incomingOffer-row-${index}`}
									data={incomingOffer}
									statusColor={statusColor}
									message={
										isCaptain ? 'would like to join' : 'would like you to join'
									}
									actionOptions={incomingActions}
								/>
							)
						})}
					</NotificationCard>
					{/* OUTGOING OFFERS*/}
					<NotificationCard
						title={isCaptain ? 'Sent invites' : 'Sent requests'}
						description={getOfferMessage(
							isCaptain,
							outgoingPending,
							'outgoing'
						)}
					>
						{outgoingOffers?.map((outgoingOffer: ExtendedOfferData, index) => (
							<NotificationCardItem
								key={`outgoingOffer-row-${index}`}
								data={outgoingOffer}
								statusColor={'bg-muted-foreground'}
								message={isCaptain ? 'invite sent for' : 'request sent for'}
								actionOptions={outgoingActions}
							/>
						))}
					</NotificationCard>
				</div>
			</div>
		</div>
	)
}
