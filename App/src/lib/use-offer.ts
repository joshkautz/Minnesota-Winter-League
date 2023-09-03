import { DocumentReference, getPlayerData } from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'

export interface OfferType {
	creator: 'player' | 'captain'
	player: DocumentReference
	team: DocumentReference
	status: 'pending' | 'accepted' | 'rejected'
	playerName: string
	teamName: string
	ref: DocumentReference
}

type SnapshotType = QuerySnapshot<DocumentData, DocumentData> | undefined

export const useOffer = (
	offerSnapshot: SnapshotType,
	teamSnapshot: SnapshotType
) => {
	const [offer, setOffer] = useState<OfferType[] | undefined>()

	useEffect(() => {
		const updateOffers = async () => {
			if (offerSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					offerSnapshot.docs.map(async (offer: DocumentData, index: number) => {
						const playerSnapshot = await getPlayerData(offer.data().player)
						const result: OfferType = {
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

	return { offer: offer }
}
