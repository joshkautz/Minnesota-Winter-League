import { ExtendedOfferData, OfferAction } from '@/lib/interfaces'
import { NotificationCardItem } from '../notification-card-item'

interface ManageOutgoingRequestsOfferRowProps {
	data: ExtendedOfferData
	color: string
	message: string
	actions: OfferAction[]
}

export const ManageOutgoingRequestsOfferRow = ({
	data,
	color,
	message,
	actions,
}: ManageOutgoingRequestsOfferRowProps) => {
	return (
		<NotificationCardItem
			data={data}
			statusColor={color}
			message={message}
			actionOptions={actions}
		/>
	)
}
