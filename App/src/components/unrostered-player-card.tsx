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
import { useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { ExtendedPlayerData, PlayerData, TeamData } from '@/lib/interfaces'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'

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
					{`${unrosteredPlayer.email}`}
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

const SearchBar = ({
	value,
	onChange,
}: {
	value: string
	onChange: React.Dispatch<React.SetStateAction<string>>
}) => {
	return (
		<div className={'pt-2'}>
			<Input
				placeholder={'Start typing to search...'}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}

export const UnrosteredPlayerList = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const [unrosteredPlayersQuerySnapshot] = useCollection(
		unrosteredPlayersQuery()
	)
	const { unrosteredPlayers, unrosteredPlayersLoading } = useUnrosteredPlayers(
		unrosteredPlayersQuerySnapshot
	)
	const [search, setSearch] = useState('')

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
			.catch(() => {
				toast({
					title: 'Unable to send invite',
					description: 'Ensure your email is verified. Please try again later.',
					variant: 'destructive',
				})
			})
	}

	const filteredPlayers = unrosteredPlayers?.filter((player) => {
		const fullName = `${player.firstname} ${player.lastname}`
		return (
			fullName.toLowerCase().includes(search.toLowerCase()) ||
			player.email.toLowerCase().includes(search.toLowerCase())
		)
	})

	return (
		<NotificationCard
			description={'players eligible for team roster invitations.'}
			scrollArea
			title={'Unrostered players'}
			searchBar={<SearchBar value={search} onChange={setSearch} />}
		>
			{unrosteredPlayersLoading ? (
				Array.from({ length: 10 }).map((_, index) => (
					<Skeleton key={index} className="mb-2">
						<div className="flex items-end gap-2 py-2">
							<div className="ml-2">
								<Skeleton className="w-20 h-5" />

								<Skeleton className="h-5 mt-1 w-36" />
							</div>
							<Skeleton className="flex justify-end w-20 gap-2 ml-auto mr-2">
								<Button size={'sm'} variant={'ghost'} />
							</Skeleton>
						</div>
					</Skeleton>
				))
			) : filteredPlayers?.length ? (
				filteredPlayers?.map((unrosteredPlayer: ExtendedPlayerData, index) => (
					<UnrosteredPlayerDetail
						key={`unrostered-player-${index}`}
						handleInvite={handleInvite}
						teamRef={documentSnapshot!.data()!.team}
						unrosteredPlayer={unrosteredPlayer}
					/>
				))
			) : (
				<span>No players found</span>
			)}
		</NotificationCard>
	)
}
