import { DocumentReference, getPlayerData } from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'

export interface OfferType {
	creator: 'player' | 'captain'
	player: DocumentReference
	team: DocumentReference
	status: 'pending' | 'accepted' | 'rejected'
	playerName: DocumentData
	teamName: DocumentData
}

type SnapshotType = QuerySnapshot<DocumentData, DocumentData> | undefined

export const useOfferData = (
	offerSnapshot: SnapshotType,
	teamSnapshot: SnapshotType
) => {
	const [offerData, setOfferData] = useState<OfferType[] | undefined>()

	useEffect(() => {
		const updateOffers = async () => {
			if (offerSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					offerSnapshot.docs.map(async (offer: DocumentData) => {
						const playerSnapshot = await getPlayerData(offer.data().player)
						const result: OfferType = {
							...offer.data(),
							playerName: `${playerSnapshot.data()
								?.firstname} ${playerSnapshot.data()?.lastname}`,
							teamName: teamSnapshot?.docs
								.find((team) => team.id == offer.data().team.id)
								?.data().name,
						}
						return result
					})
				)

				setOfferData(updatedOffers)
			}
		}

		updateOffers()
	}, [offerSnapshot, teamSnapshot])

	return { offerData }
}
