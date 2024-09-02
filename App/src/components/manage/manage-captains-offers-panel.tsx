import { ExtendedOfferData, OfferData, OfferStatus } from '@/lib/interfaces'
import { NotificationCard } from '../notification-card'
import { useOffersContext } from '@/contexts/offers-context'
import { useOffer } from '@/lib/use-offer'
import { useTeamsContext } from '@/contexts/teams-context'
import {
	DocumentReference,
	DocumentData,
	rejectOffer,
	acceptOffer,
} from '@/firebase/firestore'
import { toast } from '@/components/ui/use-toast'
import { ReactNode } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { NotificationCardItem } from '../notification-card-item'
import { ManageOutgoingInvitesOfferRow } from './manage-outgoing-invites-offer-row'

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

enum OfferType {
	INCOMING = 'incoming',
	OUTGOING = 'outgoing',
}

const getOfferMessage = (count: number | undefined, type: OfferType) => {
	const term = type === OfferType.INCOMING ? 'invite' : 'request'
	if (!count || count === 0) {
		return `no ${term}s pending at this time.`
	}
	if (count === 1) {
		return `you have one pending ${term}.`
	}
	return `you have ${count} pending ${term}s.`
}

export const OfferRow = ({ data, color, message, actions }: OfferRowProps) => {
	return (
		<NotificationCardItem
			data={data}
			statusColor={color}
			message={message}
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

export const ManageCaptainsOffersPanel = () => {
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()
	const {
		outgoingOffersQuerySnapshot,
		outgoingOffersQuerySnapshotLoading,
		incomingOffersQuerySnapshot,
		incomingOffersQuerySnapshotLoading,
	} = useOffersContext()

	const { offers: outgoingOffers, offersLoading: outgoingOffersLoading } =
		useOffer(outgoingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)
	const { offers: incomingOffers, offersLoading: incomingOffersLoading } =
		useOffer(incomingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)

	const outgoingPending = outgoingOffers?.filter(
		(offer) => offer.status === OfferStatus.PENDING
	).length
	const incomingPending = incomingOffers?.filter(
		(offer) => offer.status === OfferStatus.PENDING
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
		offerDocumentReference: DocumentReference<OfferData, DocumentData>
	) => {
		acceptOffer(offerDocumentReference)
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
				title={'Incoming requests'}
				description={getOfferMessage(incomingPending, OfferType.INCOMING)}
			>
				{incomingOffersQuerySnapshotLoading || incomingOffersLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					incomingOffers?.map((incomingOffer: ExtendedOfferData) => (
						<ManageOutgoingInvitesOfferRow
							key={`incomingOffer-row-${incomingOffer.ref.id}`}
							data={incomingOffer}
							color={
								incomingOffer.status === OfferStatus.PENDING
									? 'bg-primary'
									: 'bg-muted-foreground'
							}
							message={'would like to join'}
							actions={incomingActions}
						/>
					))
				)}
			</OffersCard>
			<OffersCard
				title={'Outgoing invites'}
				description={getOfferMessage(outgoingPending, OfferType.OUTGOING)}
			>
				{outgoingOffersQuerySnapshotLoading || outgoingOffersLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					outgoingOffers?.map((outgoingOffer: ExtendedOfferData) => (
						<OfferRow
							key={`outgoingOffer-row-${outgoingOffer.ref.id}`}
							data={outgoingOffer}
							color={'bg-muted-foreground'}
							message={'invite sent for'}
							actions={outgoingActions}
						/>
					))
				)}
			</OffersCard>
		</div>
	)
}
