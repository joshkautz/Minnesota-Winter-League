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
	teamName: DocumentData
}

export const Home = () => {
	const {
		outgoingOffersCollectionDataSnapshot,
		incomingOffersCollectionDataSnapshot,
	} = useContext(OffersContext)
	const { collectionDataSnapshot } = useContext(TeamsContext)

	const [outgoingOffers, setOutgoingOffers] = useState(
		outgoingOffersCollectionDataSnapshot?.docs.map(
			(offer) => offer.data() as OfferType
		)
	)

	const [incomingOffers, setIncomingOffers] = useState(
		incomingOffersCollectionDataSnapshot?.docs.map(
			(offer) => offer.data() as OfferType
		)
	)

	useEffect(() => {
		const updateOffers = async () => {
			if (outgoingOffersCollectionDataSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					outgoingOffersCollectionDataSnapshot.docs.map(
						async (offer: DocumentData) => {
							const playerSnapshot = await getPlayerData(offer.data().player)
							const result: OfferType = {
								...offer.data(),
								playerName: `${playerSnapshot.data()
									?.firstname} ${playerSnapshot.data()?.lastname}`,
								teamName: collectionDataSnapshot?.docs
									.find((team) => team.id == offer.data().team.id)
									?.data().name,
							}
							return result
						}
					)
				)

				setOutgoingOffers(updatedOffers)
			}
		}

		updateOffers()
	}, [outgoingOffersCollectionDataSnapshot, collectionDataSnapshot])

	useEffect(() => {
		const updateOffers = async () => {
			if (incomingOffersCollectionDataSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					incomingOffersCollectionDataSnapshot.docs.map(
						async (offer: DocumentData) => {
							const playerSnapshot = await getPlayerData(offer.data().player)
							const result: OfferType = {
								...offer.data(),
								playerName: `${playerSnapshot.data()
									?.firstname} ${playerSnapshot.data()?.lastname}`,
								teamName: collectionDataSnapshot?.docs
									.find((team) => team.id == offer.data().team.id)
									?.data().name,
							}
							return result
						}
					)
				)

				setIncomingOffers(updatedOffers)
			}
		}

		updateOffers()
	}, [incomingOffersCollectionDataSnapshot, collectionDataSnapshot])
	console.log(incomingOffers)
	return (
		<div className="container">
			<div
				className={
					'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Home
			</div>
			<div>
				<b>Outgoing Offers (Invitations)</b>
				{outgoingOffers &&
					outgoingOffers.map((offer: DocumentData) => (
						<div key={offer.player.id}>
							Player: {offer.playerName} | Team: {offer.teamName}
						</div>
					))}
			</div>
			<div>
				<b>Incoming Offers (Requests)</b>
				{incomingOffers &&
					incomingOffers.map((offer: DocumentData) => (
						<div key={offer.player.id}>
							Player: {offer.playerName} | Team: {offer.teamName}
						</div>
					))}
			</div>
		</div>
	)
}
