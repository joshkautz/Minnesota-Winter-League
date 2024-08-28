import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Timestamp } from '@firebase/firestore'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const formatTimestamp = (timestamp: Timestamp | undefined) => {
	if (!timestamp) return
	const date = new Date(timestamp.seconds * 1000)
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}
