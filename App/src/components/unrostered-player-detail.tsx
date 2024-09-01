import {
	DocumentData,
	DocumentReference,
	QueryDocumentSnapshot,
	offersForUnrosteredPlayersQuery,
} from '@/firebase/firestore'
import { cn } from '@/lib/utils'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Button } from './ui/button'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Badge } from './ui/badge'
import { useTeamsContext } from '@/contexts/teams-context'

export const UnrosteredPlayerDetail = ({
	teamQueryDocumentSnapshot,
	playerQueryDocumentSnapshot,
	statusColor,
	handleInvite,
}: {
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
	playerQueryDocumentSnapshot: QueryDocumentSnapshot<PlayerData, DocumentData>
	statusColor?: string
	message?: string
	handleInvite: (arg: DocumentReference<PlayerData, DocumentData>) => void
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(
			playerQueryDocumentSnapshot,
			teamQueryDocumentSnapshot
		)
	)
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()

	const { firstname, lastname, email } = playerQueryDocumentSnapshot.data()

	// help me do this better
	const team = playerQueryDocumentSnapshot.data().seasons[1].team
	const currentTeam = currentSeasonTeamsQuerySnapshot?.docs.find(
		(val) => val.id === team?.id
	)
	const currentTeamname = currentTeam?.data().name

	return (
		<div className="flex items-end gap-2 py-2">
			{statusColor && (
				<span
					className={cn(
						'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
						statusColor
					)}
				/>
			)}
			<div className="mr-2">
				<p>{`${firstname} ${lastname}`}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{`${email}`}
				</p>
			</div>
			{currentTeamname && (
				<div>
					<Badge variant={'outline'}>{currentTeamname}</Badge>
				</div>
			)}
			<div className="flex justify-end flex-1 gap-2">
				<Button
					disabled={
						offersForUnrosteredPlayersQuerySnapshot &&
						offersForUnrosteredPlayersQuerySnapshot.size > 0
					}
					size={'sm'}
					variant={'outline'}
					onClick={() => {
						handleInvite(playerQueryDocumentSnapshot.ref)
					}}
				>
					Invite
				</Button>
			</div>
		</div>
	)
}
