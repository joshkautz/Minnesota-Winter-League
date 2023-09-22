import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

/////////////////////////////// Get Standings ///////////////////////////////

const standingsSnapshot = await firestore
	.collection('standings')
	.orderBy('wins', 'desc')
	.orderBy('differential', 'desc')
	.get()
console.log(
	await Promise.all(
		standingsSnapshot.docs.map((standing, index) =>
			firestore
				.collection('teams')
				.doc(standing.id)
				.get()
				.then((team) => team.data().name)
		)
	)
)
