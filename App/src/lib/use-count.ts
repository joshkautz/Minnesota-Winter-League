import { getRegisteredPlayers } from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { ExtendedTeamData, TeamData } from './interfaces'

export const useCount = (
	teamsSnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
): [ExtendedTeamData[] | undefined, boolean] => {
	const [teams, setTeams] = useState<ExtendedTeamData[] | undefined>()
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const updateTeams = async () => {
			if (teamsSnapshot) {
				setLoading(true)
				const updatedTeams: ExtendedTeamData[] = await Promise.all(
					teamsSnapshot.docs.map(async (team: DocumentData, index: number) => {
						const count = await getRegisteredPlayers(team.ref)
						const result: ExtendedTeamData = {
							...team.data(),
							registeredCount: count,
							id: teamsSnapshot.docs[index].id,
							ref: teamsSnapshot.docs[index].ref,
						}
						return result
					})
				)

				setTeams(updatedTeams)
				setLoading(false)
			}
		}

		updateTeams()
	}, [teamsSnapshot])

	return [teams, loading]
}
