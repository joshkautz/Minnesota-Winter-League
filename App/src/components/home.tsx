import { useContext, useEffect, useState } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import { TeamsContext } from '@/firebase/teams-context'
import {
	DocumentReference,
	DocumentData,
	getPlayerData,
} from '@/firebase/firestore'

interface OfferType {
	creator: 'player' | 'captain'
	player: DocumentReference
	team: DocumentReference
	status: 'pending' | 'accepted' | 'rejected'
	playerName: DocumentData
}

export const Home = () => {
	const { outgoingOffersCollectionDataSnapshot } = useContext(OffersContext)
	const { collectionDataSnapshot } = useContext(TeamsContext)
	const [offers, setOffers] = useState(
		outgoingOffersCollectionDataSnapshot?.docs.map(
			(offer) => offer.data() as OfferType
		)
	)

	const getTeamName = (teamRef: DocumentReference) => {
		return collectionDataSnapshot?.docs
			.find((team) => team.id == teamRef.id)
			?.data().name
	}

	useEffect(() => {
		const updateOffers = async () => {
			if (outgoingOffersCollectionDataSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					outgoingOffersCollectionDataSnapshot.docs.map(
						async (offer: DocumentData) => {
							const result: OfferType = {
								...offer.data(),
								playerName: (await getPlayerData(offer.data().player)).data()
									?.firstname,
							}
							console.log(result)
							return result
						}
					)
				)

				setOffers(updatedOffers)
			}
		}

		updateOffers()
	}, [outgoingOffersCollectionDataSnapshot])

	return (
		<>
			<div
				className={
					'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Home
			</div>
			<div>
				{offers &&
					offers.map((offer: DocumentData) => (
						<div key={offer.player.id}>
							Player: {offer.playerName}
							Team: {getTeamName(offer.team)}
						</div>
					))}
			</div>
		</>
	)
}
