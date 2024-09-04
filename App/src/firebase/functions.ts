import { getFunctions, httpsCallable } from 'firebase/functions'

import { app } from './app'

const functions = getFunctions(app)

const sendDropboxEmail = async () => {
	const dropboxSignSendReminderEmail = httpsCallable(
		functions,
		'dropboxSignSendReminderEmail'
	)
	return dropboxSignSendReminderEmail()
}

export { sendDropboxEmail }
