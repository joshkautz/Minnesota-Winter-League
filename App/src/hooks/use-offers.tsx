import { User } from '@/firebase/auth'
import { getOfferData } from '@/firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useOffers = (
	userRef: User | null | undefined,
	firestoreValue: DocumentData | undefined
) => {
	const [offers, setOffers] = useState<DocumentData[]>([])

	useEffect(() => {
		getOfferData(userRef, firestoreValue)
			.then((offerData) => {
				setOffers(offerData)
			})
			.catch(() => {
				setOffers([])
			})
	}, [userRef, firestoreValue])

	return { offers }
}
