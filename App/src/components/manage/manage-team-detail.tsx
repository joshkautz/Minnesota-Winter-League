import {
	DocumentData,
	DocumentSnapshot,
	QueryDocumentSnapshot,
	offersForUnrosteredPlayersQuery,
} from '@/firebase/firestore'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Link } from 'react-router-dom'

export const ManageTeamDetail = ({
	handleRequest,
	currentSeasonTeamsQueryDocumentSnapshot,
	playerDocumentSnapshot,
}: {
	handleRequest: (
		teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
	) => Promise<void> | undefined
	currentSeasonTeamsQueryDocumentSnapshot: QueryDocumentSnapshot<
		TeamData,
		DocumentData
	>
	playerDocumentSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(
			playerDocumentSnapshot,
			currentSeasonTeamsQueryDocumentSnapshot
		)
	)

	// TODO: Fix this!
	const [creatorSnapshot, creatorSnapshotLoading] = useDocument(
		currentSeasonTeamsQueryDocumentSnapshot.data().captains[0]
	)
	const isDisabled =
		offersForUnrosteredPlayersQuerySnapshot &&
		offersForUnrosteredPlayersQuerySnapshot.size > 0

	// TODO: WRONG! Fix this!
	const captainZero = `${creatorSnapshot?.data()?.firstname ?? ''} ${
		creatorSnapshot?.data()?.lastname ?? ''
	}`

	return (
		<div className="flex items-end gap-2 py-2">
			<Link to={`/teams/${currentSeasonTeamsQueryDocumentSnapshot.id}`}>
				<Avatar>
					<AvatarImage
						src={
							currentSeasonTeamsQueryDocumentSnapshot.data().logo ?? undefined
						}
						alt={'team logo'}
					/>
					<AvatarFallback>
						{currentSeasonTeamsQueryDocumentSnapshot.data().name?.slice(0, 2) ??
							'NA'}
					</AvatarFallback>
				</Avatar>
			</Link>
			<Link to={`/teams/${currentSeasonTeamsQueryDocumentSnapshot.id}`}>
				<div className="mr-2">
					<p>{currentSeasonTeamsQueryDocumentSnapshot.data().name}</p>
					<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
						{creatorSnapshotLoading
							? 'created by...'
							: `created by ${captainZero ?? 'unknown...'}`}
					</p>
				</div>
			</Link>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					size={'sm'}
					variant={'default'}
					disabled={isDisabled}
					onClick={() => handleRequest(currentSeasonTeamsQueryDocumentSnapshot)}
				>
					Request to join
				</Button>
			</div>
		</div>
	)
}
