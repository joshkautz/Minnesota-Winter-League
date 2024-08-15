import { useTeamsContext } from '@/firebase/teams-context'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotificationCard } from './notification-card'
import {
	DocumentReference,
	DocumentData,
	gamesByTeamQuery,
} from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'
import { TeamRosterPlayer } from './team-roster-player'
import { useAuthContext } from '@/firebase/auth-context'
import { useCollection } from 'react-firebase-hooks/firestore'

import { CheckCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { TeamProfilePlayerActions } from './team-profile-player-actions'
import { Skeleton } from './ui/skeleton'
import { useSeasonContext } from '@/firebase/season-context'

export const TeamProfile = () => {
	const { id } = useParams()
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } = useTeamsContext()
	const { authenticatedUserSnapshot } = useAuthContext()
	const { selectedSeason } = useSeasonContext()

	const [teamProfileImageLoaded, setTeamProfileImageLoaded] = useState(false)

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

	const isOnTeam = useMemo(
		() =>
			team
				?.data()
				.roster.some(
					(item) => item.player.id === authenticatedUserSnapshot?.id
				),
		[team, authenticatedUserSnapshot]
	)

	const [gamesSnapshot] = useCollection(gamesByTeamQuery(team?.ref))
	const [imgSrc, setImgSrc] = useState<string | undefined>()

	useEffect(() => {
		setImgSrc(team?.data().logo + `&date=${Date.now()}`)
	}, [team])

	const registrationStatus = useMemo(
		() =>
			teamsQuerySnapshotLoading ? (
				<p className="text-sm text-muted-foreground">Loading...</p>
			) : !team?.data().registered ? (
				<p className={'text-sm text-muted-foreground'}>
					You need 10 registered players in order to meet the minimum
					requirement. Registration ends Tuesday, October 31st, at 11:59pm.
				</p>
			) : (
				<p
					className={
						'text-sm text-muted-foreground inline-flex gap-2 items-center'
					}
				>
					{team?.data().name} is fully registered
					<CheckCircledIcon className="w-4 h-4" />
				</p>
			),
		[teamsQuerySnapshotLoading]
	)

	return teamsQuerySnapshotLoading ? (
		<div className={'absolute inset-0 flex items-center justify-center'}>
			<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
		</div>
	) : (
		<div className={'container'}>
			<div className={'w-1/2 md:w-1/4 my-8 mx-auto'}>
				{teamProfileImageLoaded ? null : (
					<Skeleton className="h-[100px] md:h-[250px] md:w-[1/4]" />
				)}
				<img
					style={teamProfileImageLoaded ? {} : { display: 'none' }}
					src={imgSrc}
					onLoad={() => setTeamProfileImageLoaded(true)}
					alt={'team logo'}
					className={'rounded-md'}
				/>
			</div>
			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={`${team?.data().name} team players and captains`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
					moreActions={
						isOnTeam && (
							<TeamProfilePlayerActions
								closeDialog={() => {
									setImgSrc(team?.data().logo + `&date=${Date.now()}`)
								}}
							/>
						)
					}
					footerContent={isOnTeam && isCaptain ? registrationStatus : undefined}
				>
					{team?.data().roster?.map(
						(
							item: {
								captain: boolean
								player: DocumentReference<PlayerData, DocumentData>
							},
							index: number
						) => (
							<TeamRosterPlayer
								key={`team-${index}`}
								isDisabled={!isOnTeam || !isCaptain}
								playerRef={item.player}
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
							const result =
								game.data().date.toDate() > new Date()
									? 'vs'
									: game.data().homeScore == null ||
										  game.data().awayScore == null
										? 'vs'
										: (game.data().homeScore.toString() == 'W' ||
													game.data().homeScore.toString() == 'L') &&
											  (game.data().awayScore.toString() == 'W' ||
													game.data().awayScore.toString() == 'L') &&
											  opponent == 'away' &&
											  game.data().homeScore.toString() == 'L'
											? 'Loss'
											: (game.data().homeScore.toString() == 'W' ||
														game.data().homeScore.toString() == 'L') &&
												  (game.data().awayScore.toString() == 'W' ||
														game.data().awayScore.toString() == 'L') &&
												  opponent == 'home' &&
												  game.data().awayScore.toString() == 'L'
												? 'Loss'
												: (game.data().homeScore.toString() == 'W' ||
															game.data().homeScore.toString() == 'L') &&
													  (game.data().awayScore.toString() == 'W' ||
															game.data().awayScore.toString() == 'L') &&
													  opponent == 'away' &&
													  game.data().homeScore.toString() == 'W'
													? 'Win'
													: (game.data().homeScore.toString() == 'W' ||
																game.data().homeScore.toString() == 'L') &&
														  (game.data().awayScore.toString() == 'W' ||
																game.data().awayScore.toString() == 'L') &&
														  opponent == 'home' &&
														  game.data().awayScore.toString() == 'W'
														? 'Win'
														: // zero was being interpreted as false so added integer check.
															!Number.isInteger(game.data().homeScore) ||
															  !Number.isInteger(game.data().awayScore)
															? 'vs'
															: opponent == 'away'
																? `${game.data().homeScore} - ${game.data().awayScore}`
																: `${game.data().awayScore} - ${game.data().homeScore}`

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
										{result}
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
