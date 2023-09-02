import { ReactNode, useContext } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import {
	DocumentData,
	DocumentReference,
	acceptOffer,
	rejectOffer,
} from '@/firebase/firestore'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { toast } from './ui/use-toast'
import { TeamsContext } from '@/firebase/teams-context'
import { useOfferData } from '@/lib/use-offer-data'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from './ui/card'

const NotificationCard = ({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: ReactNode
}) => {
	return (
		<Card className=" max-w-[600px] flex-1 basis-80">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	)
}

const NotificationCardItem = ({
	offer,
	statusColor,
	message,
	actionOptions,
}: {
	offer: DocumentData
	statusColor: string
	message: string
	actionOptions: { title: string; action: (arg: DocumentReference) => void }[]
}) => {
	return (
		<div className="flex items-end gap-2 py-2">
			<span
				className={cn(
					'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
					statusColor
				)}
			/>
			<div className="mr-2">
				<p>{offer.playerName}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{message} {offer.teamName}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				{actionOptions.map(({ title, action }, index) => (
					<Button
						key={`action-${index}-${title}`}
						size={'sm'}
						variant={'outline'}
						onClick={() => {
							action(offer.player.id)
						}}
					>
						{title}
					</Button>
				))}
			</div>
		</div>
	)
}

export const ManageOffers = () => {
	const {
		outgoingOffersCollectionDataSnapshot,
		incomingOffersCollectionDataSnapshot,
	} = useContext(OffersContext)
	const { collectionDataSnapshot } = useContext(TeamsContext)

	const { offerData: outgoingOffers } = useOfferData(
		outgoingOffersCollectionDataSnapshot,
		collectionDataSnapshot
	)
	const { offerData: incomingOffers } = useOfferData(
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

	// The toasts need some attention and im not getting the ref quite right yet
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
	// The toasts need some attention and im not getting the ref quite right yet
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

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-max mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Manage Invites
			</div>
			{/* I think eventually left panel will be list of teams (if player) and list of unrostered players (if captain) */}
			{/* and will stack the different types of invites on the right */}
			{/* For now though, just incoming and ougoing :) */}
			<div className={'flex flex-row flex-wrap justify-center gap-8'}>
				{/* INCOMING */}
				<NotificationCard
					title={'Pending requests'}
					description={getOfferMessage(incomingPending, 'incoming')}
				>
					{incomingOffers?.map((incomingOffer: DocumentData, index) => {
						const statusColor =
							incomingOffer.status === 'pending'
								? 'bg-primary'
								: 'bg-muted-foreground'
						return (
							<NotificationCardItem
								key={`incomingOffer-row-${index}`}
								offer={incomingOffer}
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
					{outgoingOffers?.map((outgoingOffer: DocumentData, index) => (
						<NotificationCardItem
							key={`outgoingOffer-row-${index}`}
							offer={outgoingOffer}
							statusColor={'bg-transparent'}
							message={'invite sent for'}
							actionOptions={outgoingActions}
						/>
					))}
				</NotificationCard>
			</div>
		</div>
	)
}
