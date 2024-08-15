import { useTeamsContext } from '@/firebase/teams-context'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { leaveTeam, deleteTeam } from '@/firebase/firestore'
import { useAuthContext } from '@/firebase/auth-context'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from './ui/dropdown-menu'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { DestructiveConfirmationDialog } from './destructive-confirmation-dialog'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { EditTeamDialog } from './edit-team-dialog'
import { useSeasonContext } from '@/firebase/season-context'

export const TeamProfilePlayerActions = ({
	closeDialog,
}: {
	closeDialog?: () => void
}) => {
	const { id } = useParams()
	const { teamsQuerySnapshot } = useTeamsContext()
	const { authenticatedUserSnapshot } = useAuthContext()
	const { selectedSeason } = useSeasonContext()

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

	const isCaptain = useMemo(
		() =>
			team
				?.data()
				.roster.some(
					(item) =>
						item.player.id === authenticatedUserSnapshot?.id && item.captain
				),
		[team, authenticatedUserSnapshot]
	)

	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)
	const [deleteTeamLoading, setDeleteTeamLoading] = useState(false)

	return (
		<div className="absolute right-6 top-6">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size={'sm'} variant={'ghost'}>
						<DotsVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						{isCaptain && (
							<EditTeamDialog closeDialog={closeDialog}>
								<DropdownMenuItem onClick={(event) => event.preventDefault()}>
									Edit team
								</DropdownMenuItem>
							</EditTeamDialog>
						)}
						<DestructiveConfirmationDialog
							title={'Are you sure you want to leave?'}
							description={
								'You will not be able to rejoin unless a captain accepts you back on to the roster.'
							}
							onConfirm={() => {
								if (authenticatedUserSnapshot) {
									const authenticatedUserSnapshotData =
										authenticatedUserSnapshot.data()
									if (authenticatedUserSnapshotData) {
										leaveTeam(
											authenticatedUserSnapshot.ref,
											authenticatedUserSnapshotData.team,
											setLeaveTeamLoading
										)
									}
								}
							}}
						>
							<DropdownMenuItem
								className="focus:bg-destructive focus:text-destructive-foreground"
								disabled={leaveTeamLoading}
								onClick={(event) => event.preventDefault()}
							>
								Leave team
							</DropdownMenuItem>
						</DestructiveConfirmationDialog>
						{isCaptain && (
							<DestructiveConfirmationDialog
								title={'Are you sure?'}
								description={
									'The entire team will be deleted. This action is irreversible.'
								}
								onConfirm={() => {
									if (authenticatedUserSnapshot) {
										const authenticatedUserSnapshotData =
											authenticatedUserSnapshot.data()
										if (authenticatedUserSnapshotData) {
											deleteTeam(
												authenticatedUserSnapshotData.team,
												setDeleteTeamLoading
											)
												.then(() => {
													// navigate('/')
												})
												.catch(() => {
													toast({
														title: 'Unable to delete team',
														description:
															'Ensure your email is verified. Please try again later.',
														variant: 'destructive',
													})
												})
										}
									}
								}}
							>
								<DropdownMenuItem
									className="focus:bg-destructive focus:text-destructive-foreground"
									disabled={deleteTeamLoading}
									onClick={(event) => event.preventDefault()}
								>
									Delete team
								</DropdownMenuItem>
							</DestructiveConfirmationDialog>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
