import { ExtendedOfferData, OfferData, OfferType } from '@/lib/interfaces'
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
import { ReloadIcon } from '@radix-ui/react-icons'
import { getInviteMessage, getRequestMessage } from '@/lib/utils'
import { NotificationCardItem } from '../notification-card-item'

export const ManageCaptainsOffersPanel = () => {
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()
	const {
		outgoingOffersQuerySnapshot,
		outgoingOffersQuerySnapshotLoading,
		incomingOffersQuerySnapshot,
		incomingOffersQuerySnapshotLoading,
	} = useOffersContext()

	const { offers: outgoingInvites, offersLoading: outgoingInvitesLoading } =
		useOffer(outgoingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)
	const { offers: incomingRequests, offersLoading: incomingRequestsLoading } =
		useOffer(incomingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)

	const handleReject = (
		offerDocumentReference: DocumentReference<OfferData, DocumentData>
	) => {
		rejectOffer(offerDocumentReference)
			.then(() => {
				toast({
					title: 'Success',
					description: 'Request rejected',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Failure',
					description: 'Request not rejected',
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
					title: 'Success',
					description: 'Request accepted',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Failure',
					description: 'Request not accepted',
					variant: 'destructive',
				})
			})
	}

	const handleCancel = (
		offerDocumentReference: DocumentReference<OfferData, DocumentData>
	) => {
		rejectOffer(offerDocumentReference)
			.then(() => {
				toast({
					title: 'Success',
					description: 'Invite canceled',
					variant: 'default',
				})
			})
			.catch(() => {
				toast({
					title: 'Failure',
					description: 'Invite not canceled',
					variant: 'destructive',
				})
			})
	}

	const outgoingActions = [{ title: 'Cancel', action: handleCancel }]
	const incomingActions = [
		{ title: 'Accept', action: handleAccept },
		{ title: 'Reject', action: handleReject },
	]

	return (
		<div className="max-w-[600px] flex-1 basis-80 space-y-4">
			<NotificationCard
				title={'Incoming requests'}
				description={getRequestMessage(incomingRequests?.length)}
			>
				{incomingOffersQuerySnapshotLoading || incomingRequestsLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					incomingRequests?.map((incomingRequest: ExtendedOfferData) => (
						<NotificationCardItem
							key={`incomingRequest-row-${incomingRequest.ref.id}`}
							type={OfferType.INCOMING_REQUEST}
							data={incomingRequest}
							statusColor={'bg-primary'}
							message={'would like to join'}
							actionOptions={incomingActions}
						/>
					))
				)}
			</NotificationCard>
			<NotificationCard
				title={'Outgoing invites'}
				description={getInviteMessage(outgoingInvites?.length)}
			>
				{outgoingOffersQuerySnapshotLoading || outgoingInvitesLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					outgoingInvites?.map((outgoingInvite: ExtendedOfferData) => (
						<NotificationCardItem
							key={`outgoingInvite-row-${outgoingInvite.ref.id}`}
							type={OfferType.OUTGOING_INVITE}
							data={outgoingInvite}
							statusColor={'bg-muted-foreground'}
							message={'invite sent for'}
							actionOptions={outgoingActions}
						/>
					))
				)}
			</NotificationCard>
		</div>
	)
}
