import { User } from '@/firebase/auth'
import { getOfferTeamAndPlayerData } from '@/firebase/firestore'
import { DocumentData, DocumentReference } from 'firebase/firestore'
import { useEffect, useState } from 'react'

// type Offer = {
// 	creator: 'player' | 'captain'
// 	player: DocumentReference
// 	status: 'pending' | 'accepted' | 'rejected'
// 	team: DocumentReference
// }

export interface OfferType {
	offer: DocumentData
	player: DocumentData | undefined
	team: DocumentData | undefined
}

export const useOffers = (
	userRef: User | null | undefined,
	firestoreValue: DocumentData | undefined
) => {
	const [offers, setOffers] = useState<OfferType[]>([])

	useEffect(() => {
		getOfferTeamAndPlayerData(userRef, firestoreValue)
			.then((offerData) => {
				setOffers(offerData)
			})
			.catch(() => {
				setOffers([])
			})
	}, [userRef, firestoreValue])

	return { offers }
}
