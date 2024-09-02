import { ExtendedOfferData, OfferAction } from '@/lib/interfaces'
import { NotificationCardItem } from '../notification-card-item'

interface ManageOutgoingInvitesOfferRowProps {
	data: ExtendedOfferData
	color: string
	message: string
	actions: OfferAction[]
}

export const ManageOutgoingInvitesOfferRow = ({
	data,
	color,
	message,
	actions,
}: ManageOutgoingInvitesOfferRowProps) => {
	return (
		<NotificationCardItem
			data={data}
			statusColor={color}
			message={message}
			actionOptions={actions}
		/>
	)
}
