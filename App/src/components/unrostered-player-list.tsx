import {
	DocumentData,
	DocumentReference,
	invitePlayerToJoinTeam,
	getPlayersQuery,
	QueryDocumentSnapshot,
} from '@/firebase/firestore'
import { useMemo, useState } from 'react'
import { NotificationCard } from './notification-card'
import { toast } from './ui/use-toast'
import { PlayerData, TeamData } from '@/lib/interfaces'
import { UnrosteredPlayerDetail } from './unrostered-player-detail'
import { UnrosteredPlayerSearchBar } from './unrostered-player-search-bar'
import { usePlayersSearch } from './use-players-search'
import { useDebounce } from '@/lib/use-debounce'

export const UnrosteredPlayerList = ({
	teamQueryDocumentSnapshot,
}: {
	teamQueryDocumentSnapshot:
		| QueryDocumentSnapshot<TeamData, DocumentData>
		| undefined
}) => {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)

	const playersQuery = useMemo(
		() => getPlayersQuery(debouncedSearch),
		[debouncedSearch]
	)

	const { playersQuerySnapshot, playersQuerySnapshotLoading } =
		usePlayersSearch(playersQuery)

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
				<UnrosteredPlayerSearchBar
					value={search}
					onChange={setSearch}
					searching={playersQuerySnapshotLoading}
				/>
			}
		>
			{!playersQuerySnapshot ||
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
