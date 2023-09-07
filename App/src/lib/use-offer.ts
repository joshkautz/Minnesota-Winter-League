import { getPlayerSnapshot } from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { ExtendedOfferData, OfferData, TeamData } from './interfaces'

export const useOffer = (
	offerSnapshot: QuerySnapshot<OfferData, DocumentData> | undefined,
	teamSnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
): ExtendedOfferData[] | undefined => {
	const [offer, setOffer] = useState<ExtendedOfferData[] | undefined>()

	useEffect(() => {
		const updateOffers = async () => {
			if (offerSnapshot) {
				const updatedOffers: ExtendedOfferData[] = await Promise.all(
					offerSnapshot.docs.map(async (offer: DocumentData, index: number) => {
						const playerSnapshot = await getPlayerSnapshot(offer.data().player)
						const result: ExtendedOfferData = {
							...offer.data(),
							playerName: `${playerSnapshot.data()
								?.firstname} ${playerSnapshot.data()?.lastname}`,
							teamName: teamSnapshot?.docs
								.find((team) => team.id == offer.data().team.id)
								?.data().name,
							ref: offerSnapshot.docs[index].ref,
						}
						return result
					})
				)

				setOffer(updatedOffers)
			}
		}

		updateOffers()
	}, [offerSnapshot, teamSnapshot])

	return offer
}
