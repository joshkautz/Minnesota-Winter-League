import {
	DocumentData,
	invitePlayer,
	getPlayersQuery,
	QueryDocumentSnapshot,
} from '@/firebase/firestore'
import { useCallback, useMemo, useState } from 'react'
import { NotificationCard } from '../notification-card'
import { toast } from '../ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { ManageInvitePlayerDetail } from './manage-invite-player-detail'
import { ManageInvitePlayerSearchBar } from './manage-invite-player-search-bar'
import { usePlayersSearch } from '../use-players-search'
import { useDebounce } from '@/lib/use-debounce'

export const ManageInvitePlayerList = ({
	teamQueryDocumentSnapshot,
}: {
	teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
}) => {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)

	const playersQuery = useMemo(
		() => getPlayersQuery(debouncedSearch),
		[debouncedSearch]
	)

	const { playersQuerySnapshot, playersQuerySnapshotLoading } =
		usePlayersSearch(playersQuery)

	const handleInvite = useCallback(
		(
			playerQueryDocumentSnapshot: QueryDocumentSnapshot<
				PlayerData,
				DocumentData
			>,
			teamQueryDocumentSnapshot: QueryDocumentSnapshot<TeamData, DocumentData>
		) => {
			invitePlayer(playerQueryDocumentSnapshot, teamQueryDocumentSnapshot)
				?.then(() => {
					toast({
						title: 'Invite sent',
						description: `${playerQueryDocumentSnapshot.data().firstname} ${playerQueryDocumentSnapshot.data().lastname} has been invited to join ${teamQueryDocumentSnapshot.data().name}.`,
						variant: 'default',
					})
				})
				.catch(() => {
					toast({
						title: 'Invite failed',
						description: 'Ensure your email is verified.',
						variant: 'destructive',
					})
				})
		},
		[]
	)

	return (
		<NotificationCard
			title={'Invite players'}
			description={'players eligible for team roster invitations.'}
			scrollArea
			searchBar={
				<ManageInvitePlayerSearchBar
					value={search}
					onChange={setSearch}
					searching={playersQuerySnapshotLoading}
				/>
			}
		>
			{playersQuerySnapshot?.empty || search.length === 0 ? (
				<span>No players found</span>
			) : (
				playersQuerySnapshot?.docs.map((playerQueryDocumentSnapshot) => (
					<ManageInvitePlayerDetail
						key={playerQueryDocumentSnapshot.id}
						handleInvite={handleInvite}
						teamQueryDocumentSnapshot={teamQueryDocumentSnapshot}
						playerQueryDocumentSnapshot={playerQueryDocumentSnapshot}
					/>
				))
			)}
		</NotificationCard>
	)
}
