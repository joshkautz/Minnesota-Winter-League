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

export const UnrosteredPlayerDetail = ({
	teamQueryDocumentSnapshot,
	unrosteredPlayer,
	statusColor,
	handleInvite,
}: {
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
	unrosteredPlayer: QueryDocumentSnapshot<PlayerData, DocumentData>
	statusColor?: string
	message?: string
	handleInvite: (arg: DocumentReference<PlayerData, DocumentData>) => void
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(unrosteredPlayer, teamQueryDocumentSnapshot)
	)

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
				<p>{`${unrosteredPlayer.data().firstname} ${unrosteredPlayer.data().lastname}`}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{`${unrosteredPlayer.data().email}`}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				<Button
					disabled={
						offersForUnrosteredPlayersQuerySnapshot &&
						offersForUnrosteredPlayersQuerySnapshot.size > 0
					}
					size={'sm'}
					variant={'outline'}
					onClick={() => {
						handleInvite(unrosteredPlayer.ref)
					}}
				>
					Invite
				</Button>
			</div>
		</div>
	)
}
