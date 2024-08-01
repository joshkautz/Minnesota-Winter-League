import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp({
	credential: applicationDefault(),
	projectId: 'minnesota-winter-league',
})

const firestore = getFirestore()

/////////////////////////////// Create Test Payment ///////////////////////////////

await firestore
	.collection('customers')
	.doc('yEDnOJREolY3OdQGZPxseMbvwqq1')
	.collection('payments')
	.add({})
