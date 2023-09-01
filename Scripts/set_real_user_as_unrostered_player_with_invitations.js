import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getStorage, getDownloadURL } from 'firebase-admin/storage'

import random_name from 'node-random-name'

import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from 'unique-names-generator'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()
const storage = getStorage()
const bucket = storage.bucket()

/////////////////////////////// Update Player ///////////////////////////////

const playerID = ''
const playerReference = firestore.collection('players').doc(playerID)
const playerSnapshot = await playerReference.get()
const teamID = playerSnapshot.data().team.id

await firestore.collection('players').doc(playerID).update({
	captain: false,
	team: null,
})

await new Promise((r) => setTimeout(r, 1000))

/////////////////////////////// Update Team ///////////////////////////////

await firestore
	.collection('teams')
	.doc(teamID)
	.update({
		captains: FieldValue.arrayRemove(playerReference),
		roster: FieldValue.arrayRemove(playerReference),
	})

await new Promise((r) => setTimeout(r, 1000))

/////////////////////////////// Delete Offers ///////////////////////////////

const offersSnapshot = await firestore.collection('offers').get()
for (let i = 0; i < offersSnapshot.size; i++) {
	await offersSnapshot.docs[i].ref.delete()

	await new Promise((r) => setTimeout(r, 1000))
}

/////////////////////////////// Create Offers ///////////////////////////////

const offers = []
const teams = []
const teamsQuerySnapshot = await firestore.collection('teams').get()
teamsQuerySnapshot.forEach((doc) => {
	teams.push(doc)
})

const getTeam = () => {
	return teams[Math.floor(Math.random() * teams.length)]
}

const getOffer = () => {
	const team = getTeam()

	const offer = JSON.stringify({
		team: team.id,
		player: playerReference.id,
	})

	if (offers.includes(offer)) return getOffer()

	offers.push(offer)
	return { team }
}

// Create Request offers.
for (let i = 0; i < 10; i++) {
	const { team } = getOffer()

	await firestore.collection('offers').add({
		creator: 'player',
		team: team.ref,
		player: playerReference,
		status: 'pending',
	})

	await new Promise((r) => setTimeout(r, 1000))
}

// Create Invitation offers.
for (let i = 0; i < 10; i++) {
	const { team } = getOffer()

	await firestore.collection('offers').add({
		creator: 'captain',
		team: team.ref,
		player: playerReference,
		status: 'pending',
	})

	await new Promise((r) => setTimeout(r, 1000))
}
