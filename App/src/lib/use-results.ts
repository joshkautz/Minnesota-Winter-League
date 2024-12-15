import { useMemo } from 'react'
import { DocumentData, QuerySnapshot } from '@/firebase/firestore'
import { GameData } from './interfaces'

export type TeamResult = {
	placement: number
	pointsFor: number
	pointsAgainst: number
	wins: number
	losses: number
	differential: number
}

export type SeasonPlacements = {
	[key: string]: number
}

export const FALL_2024_RESULTS: SeasonPlacements = {
	'3hp5J5ZJ5NilcAI07y57': 11,
	CsfadYYv1J1KvSj4SYd0: 10,
	GrNZCbOFMZ8bxgc1iaIb: 5,
	KNdbONsXNayHPq6uHhWp: 12,
	SlSQZZyeRXzYeScoBHM2: 2,
	UYtKXok2YrFCnOVaPsMD: 6,
	UaOUQ6B2uBB4E6K5IcGE: 7,
	Zl4NPP4kQ0GaZyiqUjbj: 4,
	kocAbvNvtF4J4z5GOl93: 3,
	nUZOOC7j8TJGCEV6aQIf: 8,
	ozExVClE1sf8BNwotdIZ: 9,
	rpmhoe8o4VDqA1xwqoqK: 1,
}

export const useResults = (
	gamesQuerySnapshot: QuerySnapshot<GameData, DocumentData> | undefined
) => {
	const results = useMemo(() => {
		const result: {
			[key: string]: TeamResult
		} = {}

		gamesQuerySnapshot?.docs.forEach((gameQueryDocumentSnapshot) => {
			const { home, away, homeScore, awayScore } =
				gameQueryDocumentSnapshot.data()

			const updateTeamResult = (
				teamId: string,
				pointsFor: number,
				pointsAgainst: number
			) => {
				const teamStats = result[teamId] ?? {
					pointsFor: 0,
					pointsAgainst: 0,
					wins: 0,
					losses: 0,
					differential: 0,
				}

				result[teamId] = {
					placement: 0,
					pointsFor: teamStats.pointsFor + pointsFor,
					pointsAgainst: teamStats.pointsAgainst + pointsAgainst,
					differential: teamStats.differential + (pointsFor - pointsAgainst),
					wins: teamStats.wins + (pointsFor > pointsAgainst ? 1 : 0),
					losses: teamStats.losses + (pointsFor < pointsAgainst ? 1 : 0),
				}
			}

			updateTeamResult(home.id, homeScore, awayScore)
			updateTeamResult(away.id, awayScore, homeScore)
		})

		return result
	}, [gamesQuerySnapshot])

	Object.entries(results).forEach(([teamId, teamResult]) => {
		teamResult.placement = FALL_2024_RESULTS[teamId]
	})

	return results
}
