import { AuthContext } from '@/firebase/auth-context'
import {
	DocumentData,
	DocumentReference,
	invitePlayerToJoinTeam,
	offersForUnrosteredPlayersQuery,
	unrosteredPlayersQuery,
} from '@/firebase/firestore'
import { useUnrosteredPlayers } from '@/lib/use-unrostered-players'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { ExtendedPlayerData, PlayerData, TeamData } from '@/lib/interfaces'

const UnrosteredPlayerDetail = ({
	teamRef,
	unrosteredPlayer,
	statusColor,
	handleInvite,
}: {
	teamRef: DocumentReference<TeamData, DocumentData>
	unrosteredPlayer: ExtendedPlayerData
	statusColor?: string
	message?: string
	handleInvite: (arg: DocumentReference<PlayerData, DocumentData>) => void
}) => {
	const [offersForUnrosteredPlayersQuerySnapshot] = useCollection(
		offersForUnrosteredPlayersQuery(unrosteredPlayer.ref, teamRef)
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
				<p>{`${unrosteredPlayer.firstname} ${unrosteredPlayer.lastname}`}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{`is looking for a team.`}
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

export const UnrosteredPlayerList = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const [unrosteredPlayersQuerySnapshot] = useCollection(
		unrosteredPlayersQuery()
	)
	const unrosteredPlayers = useUnrosteredPlayers(unrosteredPlayersQuerySnapshot)

	const handleInvite = (
		playerRef: DocumentReference<PlayerData, DocumentData>
	) => {
		invitePlayerToJoinTeam(playerRef, documentSnapshot!.data()!.team)
			.then(() => {
				toast({
					title: 'Invite sent!',
					description: 'success',
					variant: 'default',
				})
			})
			.catch((error) => {
				console.log(error)

				toast({
					title: 'Unable to send invite',
					description:
						'Something went wrong on our end. Please try again later.',
					variant: 'destructive',
				})
			})
	}

	return (
		<NotificationCard
			description={'players elligible for team roster invitations.'}
			scrollArea
			title={'Unrostered players'}
		>
			{unrosteredPlayers?.map((unrosteredPlayer: ExtendedPlayerData, index) => (
				<UnrosteredPlayerDetail
					key={`unrostered-player-${index}`}
					handleInvite={handleInvite}
					teamRef={documentSnapshot!.data()!.team}
					unrosteredPlayer={unrosteredPlayer}
				/>
			))}
		</NotificationCard>
	)
}
