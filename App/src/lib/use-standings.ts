import { useMemo } from 'react'
import { DocumentData, QuerySnapshot } from '@/firebase/firestore'
import { GameData } from './interfaces'

export const useStandings = (
	gamesQuerySnapshot: QuerySnapshot<GameData, DocumentData> | undefined
) => {
	const standings = useMemo(() => {
		const result: {
			[key: string]: {
				pointsFor: number
				pointsAgainst: number
				wins: number
				losses: number
				differential: number
			}
		} = {}

		gamesQuerySnapshot?.docs.forEach((gameQueryDocumentSnapshot) => {
			const { home, away, homeScore, awayScore } =
				gameQueryDocumentSnapshot.data()

			const updateTeamStanding = (
				teamId: string,
				pointsFor: number,
				pointsAgainst: number,
				isWin: boolean
			) => {
				const teamStats = result[teamId] ?? {
					pointsFor: 0,
					pointsAgainst: 0,
					wins: 0,
					losses: 0,
					differential: 0,
				}

				result[teamId] = {
					pointsFor: teamStats.pointsFor + pointsFor,
					pointsAgainst: teamStats.pointsAgainst + pointsAgainst,
					differential: teamStats.differential + (pointsFor - pointsAgainst),
					wins: teamStats.wins + (isWin ? 1 : 0),
					losses: teamStats.losses + (isWin ? 0 : 1),
				}
			}

			updateTeamStanding(home.id, homeScore, awayScore, homeScore > awayScore)
			updateTeamStanding(away.id, awayScore, homeScore, awayScore > homeScore)
		})

		return result
	}, [gamesQuerySnapshot])

	return standings
}
