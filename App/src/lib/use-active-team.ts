import {
	QueryDocumentSnapshot,
	DocumentData,
	DocumentReference,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'
import { TeamData } from './interfaces'
import { useTeamsContext } from '@/firebase/teams-context'

export const useActiveTeams = (
	teamsRef: DocumentReference<TeamData, DocumentData>[] | undefined
) => {
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } = useTeamsContext()
	const [activeTeams, setActiveTeams] = useState<
		QueryDocumentSnapshot<TeamData, DocumentData>[] | []
	>([])

	// const isValidTeamData = (teamData: unknown): teamData is (QueryDocumentSnapshot<TeamData, DocumentData>[])  => {
	//   if (!Array.isArray(teamData)) {
	//     return false
	//   }
	//   return true
	// }

	useEffect(() => {
		const matchingTeams: QueryDocumentSnapshot<TeamData, DocumentData>[] = []
		if (!teamsQuerySnapshotLoading && teamsRef) {
			console.log('USE EFFECT FIRING')
			teamsRef.forEach((teamRef) => {
				const team = teamsQuerySnapshot?.docs.find(
					(team) => team.id === teamRef.id
				)
				if (team) {
					matchingTeams.push(team)
				}
			})

			console.log('MATCHING TEAMS', matchingTeams)
			setActiveTeams(matchingTeams)
		}
	}, [teamsRef, teamsQuerySnapshotLoading])

	return [activeTeams]
}
