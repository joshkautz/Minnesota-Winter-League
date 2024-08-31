import {
	DocumentData,
	DocumentReference,
	invitePlayerToJoinTeam,
	getPlayersQuery,
	QueryDocumentSnapshot,
} from '@/firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { Skeleton } from './ui/skeleton'
import { UnrosteredPlayerDetail } from './unrostered-player-detail'
import { UnrosteredPlayerSearchBar } from './unrostered-player-search-bar'
import { usePlayersSearch } from './use-players-search'

export const UnrosteredPlayerList = ({
	teamQueryDocumentSnapshot,
}: {
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
}) => {
	const [search, setSearch] = useState('')

	const playersQuery = useMemo(() => getPlayersQuery(search), [search])

	const { playersQuerySnapshot, playersQuerySnapshotLoading } =
		usePlayersSearch(playersQuery)

	useEffect(() => {
		console.log(playersQuerySnapshotLoading)
	}, [playersQuerySnapshotLoading])

	const handleInvite = (
		playerRef: DocumentReference<PlayerData, DocumentData>
	) => {
		invitePlayerToJoinTeam(playerRef, teamQueryDocumentSnapshot)
			?.then(() => {
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

	return (
		<NotificationCard
			title={'Unrostered players'}
			description={'players eligible for team roster invitations.'}
			scrollArea
			searchBar={
				<UnrosteredPlayerSearchBar value={search} onChange={setSearch} />
			}
		>
			{playersQuerySnapshotLoading ? (
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
			) : !playersQuerySnapshot ||
			  playersQuerySnapshot.empty ||
			  search.length === 0 ? (
				<span>No players found</span>
			) : (
				playersQuerySnapshot?.docs.map((playerQueryDocumentSnapshot, index) => (
					<UnrosteredPlayerDetail
						key={`unrostered-player-${index}`}
						handleInvite={handleInvite}
						teamQueryDocumentSnapshot={teamQueryDocumentSnapshot}
						playerQueryDocumentSnapshot={playerQueryDocumentSnapshot}
					/>
				))
			)}
		</NotificationCard>
	)
}
