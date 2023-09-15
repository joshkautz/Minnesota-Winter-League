import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
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


/////////////////////////////// Get Teams ///////////////////////////////

const teams = []
const teamsSnapshot = await firestore.collection('teams').get()
teamsSnapshot.forEach((doc) => {
  teams.push(doc)
})

/////////////////////////////// Create Games ///////////////////////////////

const getTeam = () => {
  const i = Math.floor(Math.random() * teams.length)
  const result = teams[i];
  teams.splice(i, 1)
	return result
}

const numberOfTeams = teams.length

for (let i = 1; i <= numberOfTeams / 2; i++) {
  const home = getTeam()
  const away = getTeam()

  await firestore.collection('games').add({
    home: home.ref,
    away: away.ref,
    homeScore: null,
    awayScore: null,
    date: Timestamp.fromDate(new Date(Date.parse('11 Nov 2023 20:20:00 CST'))),
    field: i.toString(),
  })

	await new Promise((r) => setTimeout(r, 250))
}