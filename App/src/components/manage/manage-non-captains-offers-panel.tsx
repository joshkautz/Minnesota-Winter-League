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

export const ManageNonCaptainsOffersPanel = () => {
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()
	const {
		outgoingOffersQuerySnapshot,
		outgoingOffersQuerySnapshotLoading,
		incomingOffersQuerySnapshot,
		incomingOffersQuerySnapshotLoading,
	} = useOffersContext()

	const { offers: outgoingRequests, offersLoading: outgoingRequestsLoading } =
		useOffer(outgoingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)
	const { offers: incomingInvites, offersLoading: incomingInvitesLoading } =
		useOffer(incomingOffersQuerySnapshot, currentSeasonTeamsQuerySnapshot)

	const handleReject = (
		offerDocumentReference: DocumentReference<OfferData, DocumentData>
	) => {
		rejectOffer(offerDocumentReference)
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
			<NotificationCard
				title={'Incoming invites'}
				description={getInviteMessage(incomingInvites?.length)}
			>
				{incomingOffersQuerySnapshotLoading || incomingInvitesLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					incomingInvites?.map((incomingInvite: ExtendedOfferData) => (
						<NotificationCardItem
							key={`incomingInvite-row-${incomingInvite.ref.id}`}
							type={OfferType.INCOMING_INVITE}
							data={incomingInvite}
							statusColor={'bg-primary'}
							message={'would like you to join'}
							actionOptions={incomingActions}
						/>
					))
				)}
			</NotificationCard>{' '}
			<NotificationCard
				title={'Outgoing requests'}
				description={getRequestMessage(outgoingRequests?.length)}
			>
				{outgoingOffersQuerySnapshotLoading || outgoingRequestsLoading ? (
					<div className={'inset-0 flex items-center justify-center'}>
						<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
					</div>
				) : (
					outgoingRequests?.map((outgoingRequest: ExtendedOfferData) => (
						<NotificationCardItem
							key={`outgoingRequest-row-${outgoingRequest.ref.id}`}
							type={OfferType.OUTGOING_REQUEST}
							data={outgoingRequest}
							statusColor={'bg-muted-foreground'}
							message={'request sent for'}
							actionOptions={outgoingActions}
						/>
					))
				)}
			</NotificationCard>
		</div>
	)
}
