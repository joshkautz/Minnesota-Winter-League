import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const toCamelCase = (inputString: string) => {
	const words = inputString.split(/[_\s]+/)
	const camelCaseWords = [
		words[0].toLowerCase(),
		...words
			.slice(1)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)),
	]
	const camelCaseString = camelCaseWords.join('')
	return camelCaseString
}

export const toTitleCase = (inputString: string) => {
	const words = inputString.split(/(?=[A-Z])/)
	const titleCaseWords = words.map(
		(word) => word.charAt(0).toUpperCase() + word.slice(1)
	)
	const titleCaseText = titleCaseWords.join(' ')
	return titleCaseText
}
