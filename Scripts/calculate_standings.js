import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

/////////////////////////////// Get Teams ///////////////////////////////

const teams = []
const teamsSnapshot = await firestore.collection('teams').get()
teamsSnapshot.forEach((team) => {
	teams.push(team)
})

/////////////////////////////// Create Standings ///////////////////////////////

for (let i = 0; i < teams.length; i++) {
	const snapshot = await firestore
		.collection('standings')
		.doc(teams[i].id)
		.get()
	if (!snapshot.exists) {
		await firestore.collection('standings').doc(teams[i].id).create({
			pointsFor: 0,
			pointsAgainst: 0,
			wins: 0,
			losses: 0,
			differential: 0,
		})
		await new Promise((r) => setTimeout(r, 250))
	}
}

/////////////////////////////// Get Standings ///////////////////////////////

const standings = []
const standingsSnapshot = await firestore.collection('standings').get()
standingsSnapshot.forEach((standing) => {
	standings.push(standing)
})

/////////////////////////////// Get Games ///////////////////////////////

const games = []
const gamesSnapshot = await firestore
	.collection('games')
	.where('date', '<=', new Date())
	.get()
gamesSnapshot.forEach((game) => {
	games.push(game)
})

/////////////////////////////// Iterate through Games ///////////////////////////////

for (let i = 0; i < games.length; i++) {
	const homeTeamId = games[i].data().home.id
	const awayTeamId = games[i].data().away.id
	await firestore
		.collection('standings')
		.doc(homeTeamId)
		.update({
			pointsFor: FieldValue.increment(games[i].data().homeScore),
			pointsAgainst: FieldValue.increment(games[i].data().awayScore),
			wins: FieldValue.increment(
				games[i].data().homeScore > games[i].data().awayScore ? 1 : 0
			),
			losses: FieldValue.increment(
				games[i].data().homeScore > games[i].data().awayScore ? 0 : 1
			),
			differential: FieldValue.increment(
				games[i].data().homeScore - games[i].data().awayScore
			),
		})

	await firestore
		.collection('standings')
		.doc(awayTeamId)
		.update({
			pointsFor: FieldValue.increment(games[i].data().awayScore),
			pointsAgainst: FieldValue.increment(games[i].data().homeScore),
			wins: FieldValue.increment(
				games[i].data().awayScore > games[i].data().homeScore ? 1 : 0
			),
			losses: FieldValue.increment(
				games[i].data().awayScore > games[i].data().homeScore ? 0 : 1
			),
			differential: FieldValue.increment(
				games[i].data().awayScore - games[i].data().homeScore
			),
		})

	await new Promise((r) => setTimeout(r, 250))
}
