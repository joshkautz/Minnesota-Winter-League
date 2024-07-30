import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

/////////////////////////////// Get Games ///////////////////////////////

const games = []
const gamesSnapshot = await firestore
	.collection('games')
	.where('date', '>=', new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000))
	.where('date', '<=', new Date())
	.get()
gamesSnapshot.forEach((game) => {
	games.push(game)
})

const teams = []
const teamsSnapshot = await firestore.collection('teams').get()
teamsSnapshot.forEach((team) => {
	teams[team.id] = team
})

// games.forEach((game) => {
// 	console.log(
// 		`${teams[game.data().home.id].data().name} ${game.data().homeScore} - ${
// 			game.data().awayScore
// 		} ${teams[game.data().away.id].data().name}`,
// 		game.data().date.toDate().toLocaleString(undefined, {
// 			weekday: 'long', // Full weekday name
// 			month: 'long', // Full month name
// 			day: 'numeric', // Day of the month
// 			hour: 'numeric', // Hour (1-12)
// 			minute: '2-digit', // Minute (2-digit)
// 			hour12: true, // Use 12-hour clock format (AM/PM)
// 		})
// 	)
// })

/////////////////////////////// Iterate through Games ///////////////////////////////

for (let i = 0; i < games.length; i++) {
	console.log(
		`${teams[games[i].data().home.id].data().name} ${
			games[i].data().homeScore
		} - ${games[i].data().awayScore} ${
			teams[games[i].data().away.id].data().name
		}`,
		games[i].data().date.toDate().toLocaleString(undefined, {
			weekday: 'long', // Full weekday name
			month: 'long', // Full month name
			day: 'numeric', // Day of the month
			hour: 'numeric', // Hour (1-12)
			minute: '2-digit', // Minute (2-digit)
			hour12: true, // Use 12-hour clock format (AM/PM)
		})
	)

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
