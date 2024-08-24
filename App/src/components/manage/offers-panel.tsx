import { ExtendedOfferData, OfferData } from '@/lib/interfaces'
import { NotificationCard, NotificationCardItem } from '../notification-card'
import { useOffersContext } from '@/firebase/offers-context'
import { useOffer } from '@/lib/use-offer'
import { useTeamsContext } from '@/firebase/teams-context'
import {
	DocumentReference,
	DocumentData,
	rejectOffer,
	acceptOffer,
} from '@/firebase/firestore'
import { toast } from '@/components/ui/use-toast'
import { ReactNode } from 'react'

interface OfferAction {
	title: string
	action: (offerRef: DocumentReference<OfferData, DocumentData>) => void
}
interface OfferRowProps {
	data: ExtendedOfferData
	color: string
	message: string
	actions: OfferAction[]
}

const getOfferMessage = (
	isAuthenticatedUserCaptain: boolean | undefined,
	num: number | undefined,
	type: 'incoming' | 'outgoing'
) => {
	if (isAuthenticatedUserCaptain) {
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

export const OfferRow = ({ data, color, message, actions }: OfferRowProps) => {
	return (
		<NotificationCardItem
			data={data}
			statusColor={color}
			message={message}
			// message={
			// 	isAuthenticatedUserCaptain
			// 		? 'would like to join'
			// 		: 'would like you to join'
			// }
			actionOptions={actions}
		/>
	)
}

export const OffersCard = ({
	title,
	description,
	children,
}: {
	title: string
	description: string
	children: ReactNode
}) => {
	return (
		<NotificationCard title={title} description={description}>
			{children}
		</NotificationCard>
	)
}

export const OffersPanel = ({ isCaptain }: { isCaptain?: boolean }) => {
	const { outgoingOffersQuerySnapshot, incomingOffersQuerySnapshot } =
		useOffersContext()
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()

	const outgoingOffers = useOffer(
		outgoingOffersQuerySnapshot,
		currentSeasonTeamsQuerySnapshot
	)
	const incomingOffers = useOffer(
		incomingOffersQuerySnapshot,
		currentSeasonTeamsQuerySnapshot
	)

	const outgoingPending = outgoingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length
	const incomingPending = incomingOffers?.filter(
		(offer) => offer.status === 'pending'
	).length

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

	const outgoingActions = [{ title: 'Cancel', action: handleReject }]
	const incomingActions = [
		{ title: 'Accept', action: handleAccept },
		{ title: 'Reject', action: handleReject },
	]

	return (
		<div className="max-w-[600px] flex-1 basis-80 space-y-4">
			<OffersCard
				title={isCaptain ? 'Pending requests' : 'Pending invites'}
				description={getOfferMessage(isCaptain, incomingPending, 'incoming')}
			>
				{incomingOffers?.map((incomingOffer: ExtendedOfferData, index) => (
					<OfferRow
						key={`incomingOffer-row-${index}`}
						data={incomingOffer}
						color={
							incomingOffer.status === 'pending'
								? 'bg-primary'
								: 'bg-muted-foreground'
						}
						message={
							isCaptain ? 'would like to join' : 'would like you to join'
						}
						actions={incomingActions}
					/>
				))}
			</OffersCard>
			<OffersCard
				title={isCaptain ? 'Sent invites' : 'Sent requests'}
				description={getOfferMessage(isCaptain, outgoingPending, 'outgoing')}
			>
				{outgoingOffers?.map((outgoingOffer: ExtendedOfferData, index) => (
					<OfferRow
						key={`outgoingOffer-row-${index}`}
						data={outgoingOffer}
						color={'bg-muted-foreground'}
						message={isCaptain ? 'invite sent for' : 'request sent for'}
						actions={outgoingActions}
					/>
				))}
			</OffersCard>
		</div>
	)
}
