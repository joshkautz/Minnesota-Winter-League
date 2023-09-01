import {
	JSXElementConstructor,
	ReactElement,
	ReactNode,
	ReactPortal,
	useContext,
	useEffect,
	useState,
} from 'react'
import { OffersContext } from '@/firebase/offers-context'
import { DocumentReference, getDoc } from '@firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { DocumentData, getPlayerData, playerDocRef } from '@/firebase/firestore'

const DisplayName = (ref) => {
	const [value, loading, error] = useDocumentData(playerDocRef(ref))
	if (loading) {
		return <div>loading</div>
	}
	if (error) {
		return <div>error</div>
	}
	return <div>{value?.firstname}</div>
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

	const [uiData, setUiData] = useState<DocumentData[]>([])

	useEffect(() => {
		if (!invitations) {
			return
		}

		const data = invitations.docs.map(async (offerDoc) => ({
			...offerDoc.data(),
			playerData: await getPlayerData(offerDoc.data().player),
		}))

		setUiData(data)
	}, [JSON.stringify(invitations)])

	return (
		<div className={'container'}>
			<div className="ring"></div>
			<div className="ring">
				<div>
					{isLoading ? (
						<div>Loading Data</div>
					) : (
						<>
							{uiData &&
								uiData.map((data, index) => {
									return (
										<div
											key={index}
											className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
										>
											<span className="flex w-2 h-2 translate-y-1 rounded-full bg-primary" />
											<div className="space-y-1">
												<p className="text-sm font-medium leading-none">
													{data.status}
												</p>
												<p className="text-sm text-muted-foreground">
													{data.firstName}
												</p>
											</div>
										</div>
									)
								})}
							{/* {requests &&
								requests.docs.map((notification, index) => {
									return (
										<div
											key={index}
											className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
										>
											<span className="flex w-2 h-2 translate-y-1 rounded-full bg-primary" />
											<div className="space-y-1">
												<p className="text-sm font-medium leading-none">
													{notification.creator}
												</p>
												<p className="text-sm text-muted-foreground">
													{notification.status}
												</p>
												<DisplayName ref={notification?.player} />
											</div>
										</div>
									)
								})} */}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
