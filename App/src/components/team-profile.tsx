import { TeamsContext } from '@/firebase/teams-context'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import {
	CheckCircledIcon,
	DotsVerticalIcon,
	ReloadIcon,
} from '@radix-ui/react-icons'
import { DestructiveConfirmationDialog } from './destructive-confirmation-dialog'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { EditTeamDialog } from './edit-team-dialog'
import { Skeleton } from './ui/skeleton'

export const TeamProfile = () => {
	const { id } = useParams()
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } =
		useContext(TeamsContext)
	const { documentSnapshot } = useContext(AuthContext)

	const isCaptain = documentSnapshot?.data()?.captain

	const [loaded, setLoaded] = useState(false)

	const team = useMemo(() => {
		return id
			? teamsQuerySnapshot?.docs.find((team) => team.id === id)
			: teamsQuerySnapshot?.docs.find(
					(team) => team.id === documentSnapshot?.data()?.team?.id
			  )
	}, [id, documentSnapshot, teamsQuerySnapshot])

	const isOnTeam = team
		?.data()
		.roster.some((player) => player.id === documentSnapshot?.id)

	const [gamesSnapshot] = useCollection(gamesByTeamQuery(team?.ref))
	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)
	const [deleteTeamLoading, setDeleteTeamLoading] = useState(false)
	const [imgSrc, setImgSrc] = useState<string | undefined>()

	useEffect(() => {
		setImgSrc(team?.data().logo + `&date=${Date.now()}`)
	}, [team])

	const registrationStatus = teamsQuerySnapshotLoading ? (
		<p className="text-sm text-muted-foreground">Loading...</p>
	) : !team?.data().registered ? (
		<p className={'text-sm text-muted-foreground'}>
			You need 10 registered players in order to meet the minimum requirement.
			Registration ends Tuesday, October 31st, at 11:59pm.
		</p>
	) : (
		<p
			className={'text-sm text-muted-foreground inline-flex gap-2 items-center'}
		>
			{team?.data().name} is fully registered
			<CheckCircledIcon className="w-4 h-4" />
		</p>
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
						{isCaptain && (
							<EditTeamDialog
								closeDialog={() => {
									setImgSrc(team?.data().logo + `&date=${Date.now()}`)
								}}
							>
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

	return teamsQuerySnapshotLoading ? (
		<div className={'absolute inset-0 flex items-center justify-center'}>
			<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
		</div>
	) : (
		<div className={'container'}>
			<div className={'w-1/2 md:w-1/4 my-8 mx-auto'}>
				{loaded ? null : (
					<Skeleton className="h-[100px] md:h-[250px] md:w-[1/4]" />
				)}

				<img
					style={loaded ? {} : { display: 'none' }}
					src={imgSrc}
					onLoad={() => setLoaded(true)}
					alt={'team logo'}
					className={'rounded-md'}
				/>

				{/* //   :
          //   (
					// <div className={'text-center text-2xl font-bold'}>
					// 	{'Team Profile'}
					// </div>
          //   ) */}
			</div>
			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={`${team?.data().name} team players and captains`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
					moreActions={isOnTeam && playerActions}
					footerContent={isOnTeam && isCaptain ? registrationStatus : undefined}
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
									className={'flex items-center justify-between w-full h-8'}
								>
									<p
										className={
											'flex grow-[1] select-none basis-[92px] shrink-0'
										}
									>
										{game.data().date.toDate().toLocaleDateString()}
									</p>
									<p
										className={
											'flex grow-[1] text-center basis-[74px] shrink-0 select-none'
										}
									>
										{game.data().date.toDate() > new Date()
											? 'vs'
											: !Number.isInteger(game.data().homeScore) ||
											  !Number.isInteger(game.data().awayScore)
											? 'vs'
											: opponent == 'away'
											? `${game.data().homeScore} - ${game.data().awayScore}`
											: `${game.data().awayScore} - ${game.data().homeScore}`}
									</p>
									<div className="flex grow-[3] shrink-0 basis-[100px] overflow-hidden text-clip">
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
