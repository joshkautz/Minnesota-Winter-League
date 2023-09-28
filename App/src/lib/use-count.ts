import {
	QueryDocumentSnapshot,
	getRegisteredPlayers,
} from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { ExtendedTeamData, TeamData } from './interfaces'

export const useTeamsCount = (
	teamsSnapshot: QuerySnapshot<TeamData, DocumentData> | undefined
): [ExtendedTeamData[] | undefined, boolean] => {
	const [teams, setTeams] = useState<ExtendedTeamData[] | undefined>()
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		console.log('firing 1')

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

export const useTeamCount = (
	teamSnapshot: QueryDocumentSnapshot<TeamData, DocumentData> | undefined
): [ExtendedTeamData | undefined, boolean] => {
	const [team, setTeam] = useState<ExtendedTeamData | undefined>()
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		console.log('firing 2')
		const updateTeam = async () => {
			if (teamSnapshot) {
				setLoading(true)
				const count = await getRegisteredPlayers(teamSnapshot.ref)
				const result: ExtendedTeamData = {
					...teamSnapshot.data(),
					registeredCount: count,
					id: teamSnapshot.id,
					ref: teamSnapshot.ref,
				}

				setTeam(result)
				setLoading(false)
			}
		}

		updateTeam()
	}, [JSON.stringify(teamSnapshot)])

	return [team, loading]
}
