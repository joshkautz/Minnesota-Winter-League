import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

const Teams = {
	Chaska: 'teams/OS4oMGXE3yAHkbGTKK5W',
	Seatbelt: 'teams/b3BM1rI4q2JuzLyPHh2K',
	Birdtown: 'teams/DTzWGB7fMbUVcL3iHT08',
	Surly: 'teams/2I7YXDF7RAXs3MCvLM0h',
	Nipull: 'teams/67XqRkRUwClXW8VMbuYQ',
	Sleepy: 'teams/JFIJXG08u9bMEDnzsgFr',
	Centrifugal: 'teams/ifnI8V4AXxq28B0nWjJc',
	Seacows: 'teams/nw1HrX3dXZMecbbTSGsR',
	DarkKnights: 'teams/cK26PQEyfvmmWpegVQzq',
	Body: 'teams/Gv5elo2IVFTc3Ldv9AkO',
	JOT: 'teams/AE9qWaJmhxI300Gbbuye',
	FATU: 'teams/hJnBb3ALKZILxo0RNfYY',
}

/////////////////////////////// Create Games ///////////////////////////////

let date = new Date(Date.parse('16 Dec 2023 18:05:00 CST'))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Chaska),
	away: firestore.doc(Teams.Nipull),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '1',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Seacows),
	away: firestore.doc(Teams.Surly),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '2',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.DarkKnights),
	away: firestore.doc(Teams.FATU),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '3',
})

await new Promise((r) => setTimeout(r, 250))

date = new Date(Date.parse('16 Dec 2023 18:50:00 CST'))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Seatbelt),
	away: firestore.doc(Teams.Birdtown),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '1',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Centrifugal),
	away: firestore.doc(Teams.Sleepy),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '2',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Body),
	away: firestore.doc(Teams.JOT),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '3',
})

await new Promise((r) => setTimeout(r, 250))

// date = new Date(Date.parse('16 Dec 2023 19:35:00 CST'))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Eight),
// 	away: firestore.doc(Teams.Nine),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '1',
// })

// await new Promise((r) => setTimeout(r, 250))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Two),
// 	away: firestore.doc(Teams.Twelve),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '2',
// })

// await new Promise((r) => setTimeout(r, 250))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Three),
// 	away: firestore.doc(Teams.Seven),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '3',
// })

// await new Promise((r) => setTimeout(r, 250))

// date = new Date(Date.parse('16 Dec 2023 20:20:00 CST'))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Four),
// 	away: firestore.doc(Teams.Six),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '1',
// })

// await new Promise((r) => setTimeout(r, 250))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Five),
// 	away: firestore.doc(Teams.Twelve),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '2',
// })

// await new Promise((r) => setTimeout(r, 250))

// await firestore.collection('games').add({
// 	home: firestore.doc(Teams.Three),
// 	away: firestore.doc(Teams.Ten),
// 	homeScore: null,
// 	awayScore: null,
// 	date: Timestamp.fromDate(date),
// 	field: '3',
// })

// await new Promise((r) => setTimeout(r, 250))