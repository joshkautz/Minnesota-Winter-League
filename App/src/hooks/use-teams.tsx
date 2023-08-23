import { getAllTeams } from '@/firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useTeams = () => {
	const [teams, setTeams] = useState<DocumentData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const refetch = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const teamsData = await getAllTeams()
			setTeams(teamsData)
		} catch (err) {
			console.error('Error:', err)
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		refetch()
	}, [])

	return { teams, isLoading, error, refetch }
}
