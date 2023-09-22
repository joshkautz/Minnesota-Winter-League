import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

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
	.where('date', '<=', Date.now())
	.get()
gamesSnapshot.forEach((game) => {
	games.push(game)
})

/////////////////////////////// Iterate through Games ///////////////////////////////

for (let i = 0; i < games.length; i++) {
	const homeTeamId = games[i].data().home.id
	const awayTeamId = games[i].data().away.id
	const homeTeamDocSnapshot = await firestore
		.collection('standings')
		.doc(homeTeamId)
		.get()

	homeTeamDocSnapshot.exists
		? await firestore
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
				})
		: await firestore
				.collection('standings')
				.doc(homeTeamId)
				.create({
					pointsFor: FieldValue.increment(games[i].data().homeScore),
					pointsAgainst: FieldValue.increment(games[i].data().awayScore),
					wins: FieldValue.increment(
						games[i].data().homeScore > games[i].data().awayScore ? 1 : 0
					),
					losses: FieldValue.increment(
						games[i].data().homeScore > games[i].data().awayScore ? 0 : 1
					),
				})

	const awayTeamDocSnapshot = await firestore
		.collection('standings')
		.doc(awayTeamId)
		.get()

	awayTeamDocSnapshot.exists
		? await firestore
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
				})
		: await firestore
				.collection('standings')
				.doc(awayTeamId)
				.create({
					pointsFor: FieldValue.increment(games[i].data().awayScore),
					pointsAgainst: FieldValue.increment(games[i].data().homeScore),
					wins: FieldValue.increment(
						games[i].data().awayScore > games[i].data().homeScore ? 1 : 0
					),
					losses: FieldValue.increment(
						games[i].data().awayScore > games[i].data().homeScore ? 0 : 1
					),
				})

	await new Promise((r) => setTimeout(r, 250))
}
