import { useAuthContext } from '@/contexts/auth-context'
import {
	DocumentData,
	DocumentReference,
	invitePlayerToJoinTeam,
} from '@/firebase/firestore'
import { useMemo, useState } from 'react'
import { NotificationCard } from './notification-card'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { PlayerData } from '@/lib/interfaces'
import { Skeleton } from './ui/skeleton'
import { useTeamsContext } from '@/contexts/teams-context'
import { useSeasonsContext } from '@/contexts/seasons-context'
import { UnrosteredPlayerDetail } from './unrostered-player-detail'
import { UnrosteredPlayerSearchBar } from './unrostered-player-search-bar'
import { usePlayersContext } from '@/contexts/players-context'

export const UnrosteredPlayerList = () => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()
	const { currentSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const { playersQuerySnapshotLoading, unrosteredPlayerQuerySnapshots } =
		usePlayersContext()

	const [search, setSearch] = useState('')

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
						)?.team?.id
			),
		[
			authenticatedUserSnapshot,
			currentSeasonTeamsQuerySnapshot,
			currentSeasonQueryDocumentSnapshot,
		]
	)

	const filteredPlayers = useMemo(
		() =>
			unrosteredPlayerQuerySnapshots?.filter((playerQueryDocumentSnapshot) => {
				const fullName = `${playerQueryDocumentSnapshot.data().firstname} ${playerQueryDocumentSnapshot.data().lastname}`
				return (
					fullName.toLowerCase().includes(search.toLowerCase()) ||
					playerQueryDocumentSnapshot
						.data()
						.email.toLowerCase()
						.includes(search.toLowerCase())
				)
			}),
		[unrosteredPlayerQuerySnapshots, search]
	)

	const handleInvite = (
		playerRef: DocumentReference<PlayerData, DocumentData>
	) => {
		invitePlayerToJoinTeam(playerRef, team)
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
			) : filteredPlayers?.length ? (
				filteredPlayers?.map((unrosteredPlayer, index) => (
					<UnrosteredPlayerDetail
						key={`unrostered-player-${index}`}
						handleInvite={handleInvite}
						teamQueryDocumentSnapshot={team}
						unrosteredPlayer={unrosteredPlayer}
					/>
				))
			) : (
				<span>No players found</span>
			)}
		</NotificationCard>
	)
}
