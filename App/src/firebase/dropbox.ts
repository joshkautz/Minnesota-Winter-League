import {} from // addDoc,
// deleteDoc,
// doc,
// query,
// where,
// getDoc,
// setDoc,
// getFirestore,
// DocumentData,
// FirestoreError,
// orderBy,
// updateDoc,
// UpdateData,
// getDocs,
// collection,
// onSnapshot,
// or,
// and,
// DocumentSnapshot,
// QueryDocumentSnapshot,
// DocumentReference,
// QuerySnapshot,
// Timestamp,
// Query,
// documentId,
'firebase/firestore'

// import { app } from './app'
// import { User } from './auth'
// import { Products } from './stripe'
// import {
// 	CheckoutSessionData,
// GameData,
// OfferData,
// PlayerData,
// TeamData,
// SeasonData,
// OfferStatus,
// OfferCreator,
// Collections,
// } from '@/lib/interfaces'
// import { deleteImage, ref, storage } from './storage'
// import { v4 as uuidv4 } from 'uuid'

// const firestore = getFirestore(app)

const sendDropboxEmail = () =>
	new Promise((resolve) => setTimeout(resolve, 1000))

// const sendDropboxEmailTest = async (
// 	authValue: User | null | undefined,
// 	setStripeLoading: React.Dispatch<React.SetStateAction<boolean>>,
// 	setStripeError: React.Dispatch<React.SetStateAction<string | undefined>>
// ) => {
// 	setStripeLoading(true)

// 	// Create new Checkout Session for the player
// 	return (
// 		addDoc(
// 			collection(firestore, `customers/${authValue?.uid}/checkout_sessions`),
// 			{
// 				mode: 'payment',
// 				price: Products.WinterLeagueRegistration2024, // TODO: Add to the season update guide. Add a new product for the new season on Stripe, then add its price code to the Products enum in stripe.ts., and then update this line to use the new product.
// 				success_url: window.location.href,
// 				cancel_url: window.location.href,
// 			}
// 		) as Promise<DocumentReference<CheckoutSessionData, DocumentData>>
// 	).then((checkoutSessionDocumentReference) => {
// 		// Listen for the URL of the Checkout Session
// 		onSnapshot(
// 			checkoutSessionDocumentReference,
// 			(checkoutSessionDocumentSnapshot) => {
// 				const data = checkoutSessionDocumentSnapshot.data()
// 				if (data) {
// 					if (data.url) {
// 						// We have a Stripe Checkout URL, let's redirect.
// 						window.location.assign(data.url)
// 					}
// 					if (data.error) {
// 						setStripeLoading(false)
// 						console.log('setting stripe error')
// 						setStripeError(data.error.message)
// 					}
// 				}
// 			}
// 		)
// 	})
// }

export {
	sendDropboxEmail,
	// sendDropboxEmailTest
}
