import {
	getFunctions,
	httpsCallable,
	HttpsCallableResult,
} from 'firebase/functions'

import { app } from './app'
import { DropboxResult } from '@/lib/interfaces'

const functions = getFunctions(app)

const sendDropboxEmail = async (): Promise<
	HttpsCallableResult<DropboxResult>
> => {
	const dropboxSignSendReminderEmail = httpsCallable<unknown, DropboxResult>(
		functions,
		'dropboxSignSendReminderEmail'
	)
	return dropboxSignSendReminderEmail()
}

export { sendDropboxEmail }
