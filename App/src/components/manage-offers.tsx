import { useContext } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import {
	DocumentReference,
	acceptOffer,
	rejectOffer,
} from '@/firebase/firestore'
import { toast } from './ui/use-toast'
import { OfferType, useOffer } from '@/lib/use-offer'
import { AuthContext } from '@/firebase/auth-context'
import { NotificationCard, NotificationCardItem } from './notification-card'
import { TeamRequestCard, TeamRosterCard } from './team-request-card'
import { UnrosteredPlayerList } from './unrostered-player-card'
import { TeamsContext } from '@/firebase/teams-context'

export const ManageOffers = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { outgoingOffersQuerySnapshot, incomingOffersQuerySnapshot } =
		useContext(OffersContext)
	const { documentSnapshot } = useContext(AuthContext)
	const isCaptain = documentSnapshot?.data()?.captain
	const isUnrostered = documentSnapshot?.data()?.team === null

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

	const handleReject = (offerRef: DocumentReference) => {
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

	const handleAccept = (offerRef: DocumentReference) => {
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
					{isUnrostered ? <TeamRequestCard /> : <TeamRosterCard />}
					{isCaptain && <UnrosteredPlayerList />}
				</div>
				{/* RIGHT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{/* INCOMING OFFERS */}
					<NotificationCard
						title={isCaptain ? 'Pending requests' : 'Pending invites'}
						description={getOfferMessage(isCaptain, incomingPending, 'incoming')}
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
									message={isCaptain ? 'would like to join' : 'would like you to join'}
									actionOptions={incomingActions}
								/>
							)
						})}
					</NotificationCard>
					{/* OUTGOING OFFERS*/}
					<NotificationCard
						title={isCaptain ? 'Sent invites' : 'Sent requests'}
						description={getOfferMessage(isCaptain, outgoingPending, 'outgoing')}
					>
						{outgoingOffers?.map((outgoingOffer: OfferType, index) => (
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
