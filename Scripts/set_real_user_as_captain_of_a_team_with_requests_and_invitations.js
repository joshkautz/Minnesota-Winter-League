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

const UID = ''

const teams = []
const teamsSnapshot = await firestore.collection('teams').get()
teamsSnapshot.forEach((doc) => {
	teams.push(doc)
})

const getTeam = () => {
	return teams[Math.floor(Math.random() * teams.length)]
}

const team = getTeam()

const playerReference = firestore.collection('players').doc(UID)

await playerReference.update({
	captain: true,
	team: team.ref,
})

await new Promise((r) => setTimeout(r, 500))

await firestore
	.collection('teams')
	.doc(team.id)
	.update({
		captains: FieldValue.arrayUnion(playerReference),
		roster: FieldValue.arrayUnion(playerReference),
	})

await new Promise((r) => setTimeout(r, 500))

/////////////////////////////// Delete Offers ///////////////////////////////

const offersSnapshot = await firestore
	.collection('offers')
	.where('player', '==', playerReference)
	.get()
for (let i = 0; i < offersSnapshot.size; i++) {
	await offersSnapshot.docs[i].ref.delete()

	await new Promise((r) => setTimeout(r, 500))
}

/////////////////////////////// Create Offers ///////////////////////////////

const offers = []
const unrosteredPlayers = []
const unrosteredPlayersSnapshot = await firestore
	.collection('players')
	.where('team', '==', null)
	.get()
unrosteredPlayersSnapshot.forEach((doc) => {
	unrosteredPlayers.push(doc)
})

const getUnrosteredPlayer = () => {
	return unrosteredPlayers[Math.floor(Math.random() * unrosteredPlayers.length)]
}

const getOffer = () => {
	const player = getUnrosteredPlayer()

	const offer = JSON.stringify({
		team: team.id,
		player: player.id,
	})

	if (offers.includes(offer)) return getOffer()

	offers.push(offer)
	return { player }
}

// Create Request offers.
for (let i = 0; i < 10; i++) {
	const { player } = getOffer()

	await firestore.collection('offers').add({
		creator: 'player',
		team: team.ref,
		player: player.ref,
		status: 'pending',
	})

	await new Promise((r) => setTimeout(r, 500))
}

// Create Invitation offers.
for (let i = 0; i < 10; i++) {
	const { player } = getOffer()

	await firestore.collection('offers').add({
		creator: 'captain',
		team: team.ref,
		player: player.ref,
		status: 'pending',
	})

	await new Promise((r) => setTimeout(r, 500))
}
