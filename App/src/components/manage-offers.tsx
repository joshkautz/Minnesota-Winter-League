import { useContext } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import { DocumentData } from '@/firebase/firestore'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const IncomingRequest = ({
	item,
	handleAccept,
	handleReject,
}: {
	item: DocumentData
	handleAccept: (arg: DocumentData) => void
	handleReject: (arg: DocumentData) => void
}) => {
	const statusColor =
		item.status === 'pending' ? 'bg-primary' : 'bg-transparent'

const Notification = ({ item }: { item: DocumentData }) => {
	return (
		<div className="flex items-end gap-2 py-2">
			<span
				className={cn(
					'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
					statusColor
				)}
			/>
			<div className="mr-2">
				<p>{item.playerName}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					requested to join {item.teamName}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					size={'sm'}
					variant={'outline'}
					onClick={() => handleAccept(item)}
				>
					Accept
				</Button>
				<Button
					size={'sm'}
					variant={'outline'}
					onClick={() => handleReject(item)}
				>
					Reject
				</Button>
			</div>
		</div>
	)
}

export const ManageOffers = () => {
	const {
		outgoingOffersCollectionDataLoading,
		incomingOffersCollectionDataLoading,
	} = useContext(OffersContext)
	const isLoading =
		incomingOffersCollectionDataLoading || outgoingOffersCollectionDataLoading

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-max mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Manage Invites
			</div>
    </div>
	)
}
