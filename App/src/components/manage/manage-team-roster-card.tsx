import { DocumentData, DocumentReference } from '@/firebase/firestore'
import { TeamsContext } from '@/firebase/teams-context'
import { ReactNode, useContext, useMemo } from 'react'
import { NotificationCard } from '../notification-card'
import { ManageTeamRosterPlayer } from './manage-team-roster-player'
import { useAuthContext } from '@/firebase/auth-context'
import { PlayerData } from '@/lib/interfaces'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { useSeasonsContext } from '@/firebase/seasons-context'

export const ManageTeamRosterCard = ({ actions }: { actions: ReactNode }) => {
	const { currentSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const {
		currentSeasonTeamsQuerySnapshot,
		currentSeasonTeamsQuerySnapshotLoading,
	} = useContext(TeamsContext)
	const {
		authenticatedUserSnapshot,
		authenticatedUserSnapshotLoading,
		authStateLoading,
	} = useAuthContext()

	const team = useMemo(
		() =>
			currentSeasonTeamsQuerySnapshot?.docs.find(
				(team) =>
					team.id ===
					authenticatedUserSnapshot
						?.data()
						?.seasons.find(
							(item) =>
								item.season.id === currentSeasonQueryDocumentSnapshot?.id
						)?.team.id
			),
		[
			authenticatedUserSnapshot,
			currentSeasonTeamsQuerySnapshot,
			currentSeasonQueryDocumentSnapshot,
		]
	)

	const isAuthenticatedUserCaptain = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.some(
					(item) =>
						item.season.id === currentSeasonQueryDocumentSnapshot?.id &&
						item.captain
				),
		[authenticatedUserSnapshot, currentSeasonQueryDocumentSnapshot]
	)

	const registrationStatus =
		authenticatedUserSnapshotLoading ||
		currentSeasonTeamsQuerySnapshotLoading ? (
			<p className="text-sm text-muted-foreground">Loading...</p>
		) : !team?.data().registered ? (
			<p className={'text-sm text-muted-foreground'}>
				You need 10 registered players in order to meet the minimum requirement.
				Registration ends Tuesday, October 31st, at 11:59pm.
			</p>
		) : (
			<p
				className={
					'text-sm text-muted-foreground inline-flex gap-2 items-center'
				}
			>
				{team?.data().name} is fully registered
				<CheckCircledIcon className="w-4 h-4" />
			</p>
		)

	const titleData = (
		<div className={'inline-flex items-center gap-2 h-4'}>
			<p>{team?.data().name}</p>
			<div className={'h-8 w-8 rounded-full overflow-hidden'}>
				<img className={'object-cover'} src={team?.data().logo} />
			</div>
		</div>
	)

	return (
		<NotificationCard
			title={
				authenticatedUserSnapshotLoading || authStateLoading
					? 'Loading...'
					: titleData
			}
			description={'Your team roster'}
			moreActions={actions}
			footerContent={
				isAuthenticatedUserCaptain ? registrationStatus : undefined
			}
		>
			{team?.data().roster.map(
				(
					item: {
						captain: boolean
						player: DocumentReference<PlayerData, DocumentData>
					},
					index: number
				) => (
					<ManageTeamRosterPlayer
						key={`team-${index}`}
						playerRef={item.player}
					/>
				)
			)}
		</NotificationCard>
	)
}
