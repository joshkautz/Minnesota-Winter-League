import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const firebaseConfig = {
	storageBucket: 'minnesota-winter-league.appspot.com',
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

/////////////////////////////// Get Emails ///////////////////////////////

const playersSnapshot = await firestore
	.collection('players')
  .where('captain', '==', true)
	.get()

// playersSnapshot.docs.map((player) =>
// 	player.data().team ? console.log(player.data().email) : null
// )

playersSnapshot.docs.map((player) => console.log(player.data().email))
