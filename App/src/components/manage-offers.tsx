import { useContext } from 'react'
import { OffersContext } from '@/firebase/offers-context'

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
			<div className={'ring flex flex-row flex-wrap justify-center gap-8'}>
				<div className="ring max-w-[600px] flex-1 basis-80">Players</div>
				<div className="ring max-w-[600px] flex-1 basis-80">
					<div>{isLoading ? <div>Loading Data</div> : <></>}</div>
				</div>
			</div>
		</div>
	)
}
