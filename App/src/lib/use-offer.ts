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
		if (offerSnapshot) {
			Promise.all(
				offerSnapshot.docs.map(async (offer: DocumentData, index: number) =>
					getPlayerSnapshot(offer.data().player).then(
						(playerSnapshot) =>
							({
								...offer.data(),
								playerName: `${
									playerSnapshot.data()?.firstname
								} ${playerSnapshot.data()?.lastname}`,
								teamName: teamSnapshot?.docs
									.find((team) => team.id == offer.data().team.id)
									?.data().name,
								ref: offerSnapshot.docs[index].ref,
							}) as ExtendedOfferData
					)
				)
			).then((updatedOffers) => setOffer(updatedOffers))
		}
	}, [offerSnapshot, teamSnapshot])

	return offer
}
