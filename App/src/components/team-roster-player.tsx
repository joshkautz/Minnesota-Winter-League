import {
	DocumentReference,
	DocumentData,
	promoteToCaptain,
	leaveTeam,
	demoteFromCaptain,
} from '@/firebase/firestore'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from './ui/dropdown-menu'
import { DotsVerticalIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { useState, useCallback, useMemo } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useAuthContext } from '@/firebase/auth-context'
import { PlayerData } from '@/lib/interfaces'
import { useDocument } from 'react-firebase-hooks/firestore'
import { DestructiveConfirmationDialog } from './destructive-confirmation-dialog'
import { toast } from './ui/use-toast'
import { Badge } from './ui/badge'
import { useSeasonContext } from '@/firebase/season-context'
import { useParams } from 'react-router-dom'
import { useTeamsContext } from '@/firebase/teams-context'

export const TeamRosterPlayer = ({
	playerRef,
}: {
	playerRef: DocumentReference<PlayerData, DocumentData>
}) => {
	const { id } = useParams()
	const { authenticatedUserSnapshot } = useAuthContext()
	const { teamsQuerySnapshot } = useTeamsContext()
	const { selectedSeason } = useSeasonContext()
	const [playerSnapshot] = useDocument(playerRef)
	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)

	const team = useMemo(
		() =>
			id
				? teamsQuerySnapshot?.docs.find((team) => team.id === id)
				: teamsQuerySnapshot?.docs.find(
						(team) =>
							team.id ===
							authenticatedUserSnapshot
								?.data()
								?.seasons.find((item) => item.season.id === selectedSeason?.id)
								?.team.id
					),
		[id, authenticatedUserSnapshot, teamsQuerySnapshot]
	)

	const isAuthenticatedUserCaptain = useMemo(
		() =>
			team
				?.data()
				.roster.some(
					(item) =>
						item.player.id === authenticatedUserSnapshot?.id && item.captain
				),
		[team, authenticatedUserSnapshot]
	)

	const isPlayerCaptain = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find((item) => item.season.id === selectedSeason?.id)
				?.captain,
		[playerSnapshot, selectedSeason]
	)

	const isPlayerPaid = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find((item) => item.season.id === selectedSeason?.id)?.paid,
		[playerSnapshot, selectedSeason]
	)

	const isPlayerSigned = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find((item) => item.season.id === selectedSeason?.id)?.signed,
		[playerSnapshot, selectedSeason]
	)

	const demoteFromCaptainOnClickHandler = useCallback(
		() =>
			demoteFromCaptain(playerRef, team?.ref, selectedSeason?.ref)
				.then(() => {
					toast({
						title: `${
							playerSnapshot?.data()?.firstname ?? 'Player'
						} is no longer a team captain`,
						description: `They are still on your roster. You may be promote them back at any time.`,
					})
				})
				.catch((error) => {
					toast({
						title: 'Unable to Demote',
						description: error.message,
						variant: 'destructive',
					})
				}),
		[team, playerSnapshot, selectedSeason]
	)

	const promoteToCaptainOnClickHandler = useCallback(
		() =>
			promoteToCaptain(playerRef, team?.ref, selectedSeason?.ref)
				.then(() => {
					toast({
						title: 'Congratulations',
						description: `${
							playerSnapshot?.data()?.firstname ?? 'Player'
						} has been promoted to team captain.`,
					})
				})
				.catch(() => {
					toast({
						title: 'Unable to Promote',
						description:
							'Ensure your email is verified. Please try again later.',
						variant: 'destructive',
					})
				}),
		[team, playerSnapshot, selectedSeason]
	)

	const removeFromTeamOnClickHandler = async () => {
		if (authenticatedUserSnapshot) {
			const data = authenticatedUserSnapshot.data()
			if (data) {
				leaveTeam(playerRef, data.team, setLeaveTeamLoading)
					.then(() => {
						toast({
							title: `${
								playerSnapshot?.data()?.firstname ?? 'Player'
							} has left the team`,
							description: 'Send player invites to build up your roster.',
						})
					})
					.catch((error) => {
						toast({
							title: 'Unable to Remove',
							description: error.message,
							variant: 'destructive',
						})
					})
			}
		}
	}

	return (
		<div>
			{playerSnapshot ? (
				<div className="flex items-end gap-2 py-2">
					<div className="flex flex-row items-center">
						<p className="mr-2 select-none">
							{playerSnapshot.data()?.firstname}{' '}
							{playerSnapshot.data()?.lastname}{' '}
						</p>
						{isPlayerCaptain && <StarFilledIcon className="text-primary" />}
					</div>
					<div className="flex justify-end flex-1 gap-2">
						<div className="flex items-center">
							<Badge
								className={'select-none hover:bg-initial'}
								variant={
									isPlayerPaid && isPlayerSigned ? 'secondary' : 'inverse'
								}
							>
								{isPlayerPaid && isPlayerSigned ? 'registered' : 'unregistered'}
							</Badge>
						</div>
						{isAuthenticatedUserCaptain && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size={'sm'} variant={'ghost'}>
										<DotsVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className={'w-56'}>
									<DropdownMenuGroup>
										<DropdownMenuItem
											disabled={!isPlayerCaptain}
											onClick={demoteFromCaptainOnClickHandler}
										>
											Demote from captain
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isPlayerCaptain}
											onClick={promoteToCaptainOnClickHandler}
										>
											Promote to captain
										</DropdownMenuItem>
										<DestructiveConfirmationDialog
											title={
												playerSnapshot.id == authenticatedUserSnapshot?.id
													? 'Are you sure you want to leave?'
													: 'Are you sure?'
											}
											description={
												playerSnapshot.id == authenticatedUserSnapshot?.id
													? 'You will not be able to rejoin until a captain accepts you back on to the roster.'
													: `${
															playerSnapshot.data()?.firstname
														} will not be able to rejoin until a captain accepts them back on to the roster.`
											}
											onConfirm={removeFromTeamOnClickHandler}
										>
											<DropdownMenuItem
												className="focus:bg-destructive focus:text-destructive-foreground"
												disabled={leaveTeamLoading}
												onClick={(event) => event.preventDefault()}
											>
												{playerSnapshot.id === authenticatedUserSnapshot?.id
													? 'Leave team'
													: 'Remove from team'}
											</DropdownMenuItem>
										</DestructiveConfirmationDialog>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			) : (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<Skeleton className="h-4 w-[250px]" />
					</div>
				</div>
			)}
		</div>
	)
}
