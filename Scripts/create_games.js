import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

/////////////////////////////// Get Teams ///////////////////////////////

const teams = []
const teamsSnapshot = await firestore.collection('teams').get()
teamsSnapshot.forEach((doc) => {
	teams.push(doc)
})

const getTeam = () => {
	const i = Math.floor(Math.random() * teams.length)
	const result = teams[i]
	teams.splice(i, 1)
	return result
}

/////////////////////////////// Create Games ///////////////////////////////

const numWeeks = 6
const numRounds = 4
const numFields = 3

// Each Week
for (let i = 0; i < numWeeks; i++) {
	let firstRoundTeams = []
	let secondRoundTeams = []
	let thirdRoundTeams = []
	let fourthRoundTeams = []

	for (let j = 0; j < teams.length / 2; j++) {
		firstRoundTeams.push(getTeam())
	}

	secondRoundTeams = [...firstRoundTeams]

	for (let j = 0; j < teams.length / 2; j++) {
		thirdRoundTeams.push(getTeam())
	}

	fourthRoundTeams = [...thirdRoundTeams]

	let getFirstSessionTeam = () => {
		const i = Math.floor(Math.random() * firstRoundTeams.length)
		const result = firstRoundTeams[i]
		firstRoundTeams.splice(i, 1)
		return result
	}

	let getSecondRoundTeam = () => {
		const i = Math.floor(Math.random() * secondRoundTeams.length)
		const result = secondRoundTeams[i]
		secondRoundTeams.splice(i, 1)
		return result
	}

	let getThirdRoundTeam = () => {
		const i = Math.floor(Math.random() * thirdRoundTeams.length)
		const result = thirdRoundTeams[i]
		thirdRoundTeams.splice(i, 1)
		return result
	}

	let getFourthRoundTeam = () => {
		const i = Math.floor(Math.random() * fourthRoundTeams.length)
		const result = fourthRoundTeams[i]
		fourthRoundTeams.splice(i, 1)
		return result
	}

	// Each Round
	for (let j = 0; j < numRounds; j++) {
		// Each field
		for (let k = 0; k < numFields; k++) {
			let home = null
			let away = null

			if (j == 0) {
				home = getFirstSessionTeam()
				away = getFirstSessionTeam()
			} else if (j == 1) {
				home = getSecondRoundTeam()
				away = getSecondRoundTeam()
			} else if (j == 2) {
				home = getThirdRoundTeam()
				away = getThirdRoundTeam()
			} else if (j == 3) {
				home = getFourthRoundTeam()
				away = getFourthRoundTeam()
			}

			const date = new Date(Date.parse('9 Sep 2023 18:00:00 CDT'))
			date.setDate(date.getDate() + 7 * i)
			date.setTime(
				date.getTime() +
					1000 * 60 * 10 +
					1000 * 60 * 40 * j +
					1000 * 60 * 10 * Math.floor(j / 2)
			)

			let homeScore = null
			let awayScore = null

			if (Date.now() < date) {
				if (Math.floor(Math.random() * 2) == 0) {
					homeScore = 15
					awayScore = Math.floor(Math.random() * 15)
				} else {
					homeScore = Math.floor(Math.random() * 15)
					awayScore = 15
				}
			}

			await firestore.collection('games').add({
				home: home.ref,
				away: away.ref,
				homeScore: homeScore,
				awayScore: awayScore,
				date: Timestamp.fromDate(date),
				field: k.toString(),
			})

			await new Promise((r) => setTimeout(r, 250))
		}
	}

	teamsSnapshot.forEach((doc) => {
		teams.push(doc)
	})
}
