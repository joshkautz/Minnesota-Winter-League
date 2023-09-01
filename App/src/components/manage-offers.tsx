import { useContext } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import { DocumentData } from '@/firebase/firestore'
import { Button } from './ui/button'

const Notification = ({ item }: { item: DocumentData }) => {
	return (
		<div className={'ring flex flex-row flex-wrap justify-center gap-8'}>
			<div className="ring max-w-[600px] flex-1 basis-80">Players</div>
			<div className="ring max-w-[600px] flex-1 basis-80">
				<div className="flex items-center gap-2 py-2 ring">
					<span className="flex content-center self-start w-2 h-2 mt-2 translate-y-1 rounded-full bg-primary" />
					<div className="space-y-1">
						{/* <p className="text-sm font-medium leading-none">pending</p> */}
					</div>
					<div className="mr-2">
						<p>player name</p>
						<p className="text-sm text-muted-foreground">
							player name would like to join your team
						</p>
					</div>
					<Button size={'sm'} variant={'outline'}>
						Accept
					</Button>
					<Button size={'sm'} variant={'outline'}>
						Reject
					</Button>
				</div>
			</div>
		</div>
	)
}

export const ManageOffers = () => {
	const {
		incomingOffersCollectionDataSnapshot: invitations,
		outgoingOffersCollectionDataLoading,
		incomingOffersCollectionDataLoading,
		outgoingOffersCollectionDataSnapshot: requests,
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
			<div className={'ring flex flex-row flex-wrap justify-center gap-8'}>
				<div className="ring max-w-[600px] flex-1 basis-80">Players</div>
				<div className="ring max-w-[600px] flex-1 basis-80">
					<div>
						{isLoading ? (
							<div>Loading Data</div>
						) : (
							<>
								{invitations &&
									invitations.docs.map((item, index) => {
										return <Notification key={index} item={item.data()} />
									})}
								{requests &&
									requests.docs.map((item, index) => {
										return <Notification key={index} item={item.data()} />
									})}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
