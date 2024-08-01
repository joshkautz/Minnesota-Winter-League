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

let date = new Date(Date.parse('16 Dec 2023 19:35:00 CST'))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Nipull),
	away: firestore.doc(Teams.Birdtown),
	homeScore: 'L',
	awayScore: 'W',
	date: Timestamp.fromDate(date),
	field: '1',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Seacows),
	away: firestore.doc(Teams.Centrifugal),
	homeScore: 10,
	awayScore: 12,
	date: Timestamp.fromDate(date),
	field: '2',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.JOT),
	away: firestore.doc(Teams.FATU),
	homeScore: null,
	awayScore: null,
	date: Timestamp.fromDate(date),
	field: '3',
})

await new Promise((r) => setTimeout(r, 250))

date = new Date(Date.parse('16 Dec 2023 20:20:00 CST'))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Seatbelt),
	away: firestore.doc(Teams.Chaska),
	homeScore: 7,
	awayScore: 13,
	date: Timestamp.fromDate(date),
	field: '1',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.Surly),
	away: firestore.doc(Teams.Sleepy),
	homeScore: 11,
	awayScore: 10,
	date: Timestamp.fromDate(date),
	field: '2',
})

await new Promise((r) => setTimeout(r, 250))

await firestore.collection('games').add({
	home: firestore.doc(Teams.DarkKnights),
	away: firestore.doc(Teams.Body),
	homeScore: 12,
	awayScore: 14,
	date: Timestamp.fromDate(date),
	field: '3',
})

await new Promise((r) => setTimeout(r, 250))
