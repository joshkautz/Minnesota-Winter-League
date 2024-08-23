import {
	DocumentData,
	QueryDocumentSnapshot,
	requestToJoinTeam,
} from '@/firebase/firestore'
import { TeamsContext } from '@/firebase/teams-context'
import { useCallback, useContext } from 'react'
import { NotificationCard } from '../notification-card'
import { useAuthContext } from '@/firebase/auth-context'
import { toast } from '../ui/use-toast'
import { TeamData } from '@/lib/interfaces'
import { ManageTeamDetail } from './manage-team-detail'

export const ManageTeamRequestCard = () => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { currentSeasonTeamsQuerySnapshot } = useContext(TeamsContext)

	const handleRequest = useCallback(
		(
			teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
		) =>
			requestToJoinTeam(authenticatedUserSnapshot, teamQueryDocumentSnapshot)
				?.then(() => {
					toast({
						title: 'Request sent',
						description: 'you requested to join',
						variant: 'default',
					})
				})
				.catch(() => {
					toast({
						title: 'Unable to send request',
						description:
							'Ensure your email is verified. Please try again later.',
						variant: 'destructive',
					})
				}),
		[authenticatedUserSnapshot]
	)

	return (
		<NotificationCard
			title={'Team list'}
			description={'request to join a team below'}
		>
			{currentSeasonTeamsQuerySnapshot?.docs.map(
				(currentSeasonTeamsQueryDocumentSnapshot) => (
					<ManageTeamDetail
						key={currentSeasonTeamsQueryDocumentSnapshot.id}
						handleRequest={handleRequest}
						currentSeasonTeamsQueryDocumentSnapshot={
							currentSeasonTeamsQueryDocumentSnapshot
						}
						playerDocumentSnapshot={authenticatedUserSnapshot}
					/>
				)
			)}
		</NotificationCard>
	)
}
