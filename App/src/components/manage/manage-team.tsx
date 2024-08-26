import { useCallback, useMemo, useState } from 'react'
import { deleteTeam, removeFromTeam } from '@/firebase/firestore'
import { toast } from '../ui/use-toast'
import { useAuthContext } from '@/firebase/auth-context'
import { ManageTeamRequestCard } from './manage-team-request-card'
import { UnrosteredPlayerList } from '../unrostered-player-card'
import { Button } from '../ui/button'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { DestructiveConfirmationDialog } from '../destructive-confirmation-dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { GradientHeader } from '../gradient-header'
import { ManageEditTeamDialog } from './manage-edit-team-dialog'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { OffersPanel } from './offers-panel'
import { useTeamsContext } from '@/firebase/teams-context'
import { ManageTeamRosterCard } from './manage-team-roster-card'

export const ManageTeam = () => {
	const { currentSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()

	const {
		authStateUser,
		authStateLoading,
		authenticatedUserSnapshot,
		authenticatedUserSnapshotLoading,
	} = useAuthContext()

	const isLoading = useMemo(
		() =>
			(!authStateUser &&
				authStateLoading &&
				!authenticatedUserSnapshot &&
				authenticatedUserSnapshotLoading) ||
			(!authStateUser &&
				authStateLoading &&
				!authenticatedUserSnapshot &&
				!authenticatedUserSnapshotLoading) ||
			(authStateUser &&
				!authStateLoading &&
				!authenticatedUserSnapshot &&
				!authenticatedUserSnapshotLoading) ||
			(authStateUser &&
				!authStateLoading &&
				!authenticatedUserSnapshot &&
				authenticatedUserSnapshotLoading),
		[
			authStateUser,
			authStateLoading,
			authenticatedUserSnapshot,
			authenticatedUserSnapshotLoading,
		]
	)

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
						)?.team.id
			),
		[
			authenticatedUserSnapshot,
			currentSeasonTeamsQuerySnapshot,
			currentSeasonQueryDocumentSnapshot,
		]
	)

	const isAuthenticatedUserCaptain = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.some(
					(item) =>
						item.season.id === currentSeasonQueryDocumentSnapshot?.id &&
						item.captain
				),
		[authenticatedUserSnapshot, currentSeasonQueryDocumentSnapshot]
	)

	const isAuthenticatedUserRostered = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.some(
					(item) =>
						item.season.id === currentSeasonQueryDocumentSnapshot?.id &&
						item.team
				),
		[authenticatedUserSnapshot, currentSeasonQueryDocumentSnapshot]
	)

	const [open, setOpen] = useState(false)

	const removeFromTeamOnClickHandler = useCallback(async () => {
		removeFromTeam(
			authenticatedUserSnapshot?.ref,
			team?.ref,
			currentSeasonQueryDocumentSnapshot?.ref
		)
			.then(() => {
				toast({
					title: `${
						authenticatedUserSnapshot?.data()?.firstname ?? 'Player'
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
	}, [authenticatedUserSnapshot, team, currentSeasonQueryDocumentSnapshot])

	const deleteTeamOnClickHandler = useCallback(async () => {
		deleteTeam(team?.ref)
			.then(() => {
				toast({
					title: `${
						authenticatedUserSnapshot?.data()?.firstname ?? 'Player'
					} has left the team`,
					description: 'Send player invites to build up your roster.',
				})
			})
			.catch((error) => {
				toast({
					title: 'Unable to Delete Team',
					description: error.message,
					variant: 'destructive',
				})
			})
	}, [authenticatedUserSnapshot, team, currentSeasonQueryDocumentSnapshot])

	const captainActions = (
		<div className="absolute right-6 top-6">
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button size={'sm'} variant={'ghost'}>
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						<ManageEditTeamDialog closeDialog={() => setOpen(false)}>
							<DropdownMenuItem onClick={(event) => event.preventDefault()}>
								Edit team
							</DropdownMenuItem>
						</ManageEditTeamDialog>
						<DestructiveConfirmationDialog
							title={'Are you sure you want to leave?'}
							description={
								'You will not be able to rejoin unless a captain accepts you back on to the roster.'
							}
							onConfirm={removeFromTeamOnClickHandler}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								onClick={(event) => event.preventDefault()}
							>
								Leave team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>

						<DestructiveConfirmationDialog
							title={'Are you sure?'}
							description={
								'The entire team will be deleted. This action is irreversible.'
							}
							onConfirm={deleteTeamOnClickHandler}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								onClick={(event) => event.preventDefault()}
							>
								Delete team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)

	const playerActions = (
		<div className="absolute right-6 top-6">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size={'sm'} variant={'ghost'}>
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						<DestructiveConfirmationDialog
							title={'Are you sure you want to leave?'}
							description={
								'You will not be able to rejoin unless a captain accepts you back on to the roster.'
							}
							onConfirm={removeFromTeamOnClickHandler}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								onClick={(event) => event.preventDefault()}
							>
								Leave team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)

	return (
		<div className={'container'}>
			<GradientHeader>
				{isLoading
					? `Loading...`
					: !isAuthenticatedUserRostered
						? `Join Team`
						: isAuthenticatedUserCaptain
							? `Manage Team`
							: `Manage Player`}
			</GradientHeader>
			<div className={'flex flex-row justify-center gap-8 flex-wrap-reverse'}>
				{/* LEFT SIDE PANEL */}
				<div className="max-w-[600px] flex-1 basis-80 space-y-4">
					{isAuthenticatedUserRostered ? (
						<ManageTeamRosterCard
							actions={
								isAuthenticatedUserCaptain ? captainActions : playerActions
							}
						/>
					) : (
						<ManageTeamRequestCard />
					)}
					{isAuthenticatedUserCaptain && <UnrosteredPlayerList />}
				</div>
				{/* RIGHT SIDE PANEL */}
				<OffersPanel isCaptain={isAuthenticatedUserCaptain} />
			</div>
		</div>
	)
}
