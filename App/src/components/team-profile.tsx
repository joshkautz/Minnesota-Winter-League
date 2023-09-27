import { TeamsContext } from '@/firebase/teams-context'
import { useContext, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NotificationCard } from './notification-card'
import {
	DocumentReference,
	DocumentData,
	gamesByTeamQuery,
	leaveTeam,
	deleteTeam,
} from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'
import { TeamRosterPlayer } from './team-roster-player'
import { AuthContext } from '@/firebase/auth-context'
import { useCollection } from 'react-firebase-hooks/firestore'
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

export const TeamProfile = () => {
	const { id } = useParams()
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const { documentSnapshot } = useContext(AuthContext)
	const navigate = useNavigate()

	const isCaptain = documentSnapshot?.data()?.captain

	const team = id
		? teamsQuerySnapshot?.docs.find((team) => team.id === id)
		: teamsQuerySnapshot?.docs.find(
				(team) => team.id === documentSnapshot?.data()?.team?.id
		  )

	const isOnTeam = team
		?.data()
		.roster.some((player) => player.id === documentSnapshot?.id)

	const [gamesSnapshot] = useCollection(gamesByTeamQuery(team?.ref))
	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)
	const [deleteTeamLoading, setDeleteTeamLoading] = useState(false)

	// from manageOffers.tsx
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
							onConfirm={() => {
								if (documentSnapshot) {
									const documentSnapshotData = documentSnapshot.data()
									if (documentSnapshotData) {
										leaveTeam(
											documentSnapshot.ref,
											documentSnapshotData.team,
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
									if (documentSnapshot) {
										const documentSnapshotData = documentSnapshot.data()
										if (documentSnapshotData) {
											deleteTeam(
												documentSnapshotData.team,
												setDeleteTeamLoading
											)
												.then(() => {
													navigate('/')
												})
												.catch(() => {
													toast({
														title: 'Unable to delete team',
														description:
															'Something went wrong. Please try again later.',
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

	return (
		<div className={'container'}>
			<div className={'max-h-[250px] w-[250px] my-8 mx-auto'}>
				{team?.data().logo ? (
					<img
						src={team?.data().logo}
						alt={'team logo'}
						className={'object-cover rounded-md'}
					/>
				) : (
					<div className={'text-center text-2xl font-bold'}>
						{'Team Profile'}
					</div>
				)}
			</div>
			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={`${team?.data().name} team players and captains`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
					moreActions={isOnTeam && playerActions}
				>
					{team
						?.data()
						.roster?.map(
							(
								playerRef: DocumentReference<PlayerData, DocumentData>,
								index: number
							) => (
								<TeamRosterPlayer
									key={`team-${index}`}
									isDisabled={!isOnTeam || !isCaptain}
									playerRef={playerRef}
								/>
							)
						)}
				</NotificationCard>
				<NotificationCard
					title={'Record'}
					description={'2023 Minneapolis Winter League'}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					<div className="flex flex-col items-end gap-2 py-2">
						{gamesSnapshot?.docs.map((game, index) => {
							const opponent = team?.id == game.data().home.id ? 'away' : 'home'
							return (
								<div
									key={`row-${index}`}
									className="flex items-center justify-between w-full h-8"
								>
									<p className="flex-1 select-none">
										{game.data().date.toDate().toLocaleDateString()}
									</p>
									<p className="flex-1 text-center select-none">
										{game.data().date.toDate() > new Date()
											? 'vs'
											: !game.data().homeScore || !game.data().awayScore
											? 'vs'
											: opponent == 'away'
											? `${game.data().homeScore} - ${game.data().awayScore}`
											: `${game.data().awayScore} - ${game.data().homeScore}`}
									</p>
									<div className="flex-[3]">
										<Link
											className="flex flex-col transition duration-300 group w-max"
											to={
												opponent == 'away'
													? `/teams/${game.data().away.id}`
													: `/teams/${game.data().home.id}`
											}
										>
											{opponent == 'away'
												? teamsQuerySnapshot?.docs
														.find((team) => team.id === game.data().away.id)
														?.data().name
												: teamsQuerySnapshot?.docs
														.find((team) => team.id === game.data().home.id)
														?.data().name}
											<span className="max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</NotificationCard>
			</div>
		</div>
	)
}
