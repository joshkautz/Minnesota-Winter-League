import { getAllTeams } from '@/firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

export const useTeams = () => {
	const [teams, setTeams] = useState<DocumentData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const refetch = useCallback(() => {
		setIsLoading(true)
		setError(null)

		getAllTeams()
			.then((teamsData) => {
				setTeams(teamsData)
			})
			.catch((err) => {
				setError(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	useEffect(() => {
		refetch()
	}, [refetch])

	return { teams, isLoading, error, refetch }
}
