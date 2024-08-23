import { useTeamsContext } from '@/firebase/teams-context'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotificationCard } from '../notification-card'
import {
	DocumentReference,
	DocumentData,
	gamesByTeamQuery,
	QueryDocumentSnapshot,
	teamsHistoryQuery,
} from '@/firebase/firestore'
import { GameData, PlayerData, TeamData } from '@/lib/interfaces'
import { TeamRosterPlayer } from './team-roster-player'
import { useAuthContext } from '@/firebase/auth-context'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Timestamp } from '@firebase/firestore'

import { CheckCircledIcon } from '@radix-ui/react-icons'
import { TeamProfilePlayerActions } from '../team-profile-player-actions'
import { Skeleton } from '../ui/skeleton'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { TeamHistory } from './team-history'
import * as TeamRecord from './team-record'

const OPPONENT = {
	HOME: 'HOME',
	AWAY: 'AWAY',
} as const

const RESULT = {
	VS: 'vs',
	UNREPORTED: 'Unreported',
} as const

const formatGameResult = (
	team: QueryDocumentSnapshot<TeamData, DocumentData> | undefined,
	gameData: GameData
) => {
	const { homeScore, awayScore } = gameData
	const opponent = team?.id == gameData.home.id ? OPPONENT.AWAY : OPPONENT.HOME
	const isInFuture = gameData.date > Timestamp.now()
	const isScoreReported =
		Number.isInteger(homeScore) && Number.isInteger(awayScore)
	return isInFuture
		? RESULT.VS
		: isScoreReported
			? opponent == OPPONENT.AWAY
				? `${homeScore} - ${awayScore}`
				: `${awayScore} - ${homeScore}`
			: RESULT.UNREPORTED
}

export const TeamProfile = () => {
	const { id } = useParams()
	const {
		selectedSeasonTeamsQuerySnapshot,
		selectedSeasonTeamsQuerySnapshotLoading,
	} = useTeamsContext()
	const { authenticatedUserSnapshot } = useAuthContext()
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const [teamProfileImageLoaded, setTeamProfileImageLoaded] = useState(false)

	const team = useMemo(
		() =>
			id
				? selectedSeasonTeamsQuerySnapshot?.docs.find((team) => team.id === id)
				: selectedSeasonTeamsQuerySnapshot?.docs.find(
						(team) =>
							team.id ===
							authenticatedUserSnapshot
								?.data()
								?.seasons.find(
									(item) =>
										item.season.id === selectedSeasonQueryDocumentSnapshot?.id
								)?.team.id
					),
		[
			id,
			authenticatedUserSnapshot,
			selectedSeasonTeamsQuerySnapshot,
			selectedSeasonQueryDocumentSnapshot,
		]
	)

	const [historyQuerySnapshot] = useCollection(
		teamsHistoryQuery(team?.data().teamId)
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

	const isAuthenticatedUserOnTeam = useMemo(
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

	// const [teamsQuerySnapshot] = useCollection(teamsHistoryQuery(team?.data().teamId))

	useEffect(() => {
		setImgSrc(team?.data().logo + `&date=${Date.now()}`)
	}, [team])

	const registrationStatus = useMemo(
		() =>
			selectedSeasonTeamsQuerySnapshotLoading ? (
				<p className="text-sm text-muted-foreground">Loading...</p>
			) : team?.data().registered ? (
				<p
					className={
						'text-sm text-muted-foreground inline-flex gap-2 items-center'
					}
				>
					{team?.data().name} is fully registered
					<CheckCircledIcon className="w-4 h-4" />
				</p>
			) : (
				<p className={'text-sm text-muted-foreground'}>
					You need 10 registered players in order to meet the minimum
					requirement. Registration ends Tuesday, October 31st, at 11:59pm.
				</p>
			),
		[selectedSeasonTeamsQuerySnapshotLoading, team]
	)

	return (
		<div className={'container'}>
			<div className={'w-1/2 md:w-1/4 my-8 mx-auto'}>
				{teamProfileImageLoaded ? null : (
					<Skeleton className="h-[100px] md:h-[250px] md:w-[1/4]" />
				)}
				<img
					onError={() => {
						setTeamProfileImageLoaded(false)
					}}
					style={teamProfileImageLoaded ? {} : { display: 'none' }}
					src={imgSrc}
					onLoad={() => {
						setTeamProfileImageLoaded(true)
					}}
					alt={'team logo'}
					className={'rounded-md'}
				/>
			</div>

			<div className="flex justify-center items-start gap-8 flex-wrap max-w-[1040px] mx-auto">
				<NotificationCard
					title={'Roster'}
					description={
						team ? `${team?.data().name} team players and captains` : ``
					}
					className={'flex-1 basis-[360px] flex-shrink-0'}
					moreActions={
						isAuthenticatedUserOnTeam && (
							<TeamProfilePlayerActions
								closeDialog={() => {
									setImgSrc(team?.data().logo + `&date=${Date.now()}`)
								}}
							/>
						)
					}
					footerContent={
						isAuthenticatedUserCaptain ? registrationStatus : <></>
					}
				>
					{team?.data().roster?.map(
						(
							item: {
								captain: boolean
								player: DocumentReference<PlayerData, DocumentData>
							},
							index: number
						) => (
							<TeamRosterPlayer key={`team-${index}`} playerRef={item.player} />
						)
					)}
				</NotificationCard>
				<TeamRecord.Root>
					{gamesSnapshot?.docs.map((game, index) => {
						const gameData = game.data()
						const opponent =
							team?.id == gameData.home.id ? OPPONENT.AWAY : OPPONENT.HOME
						const result = formatGameResult(team, gameData)

						return (
							<TeamRecord.Row key={index}>
								<TeamRecord.RowDate>
									{gameData.date.toDate().toLocaleDateString()}
								</TeamRecord.RowDate>
								<TeamRecord.RowResult>{result}</TeamRecord.RowResult>
								<div className="flex grow-[3] shrink-0 basis-[100px] overflow-hidden text-clip">
									<Link
										className="flex flex-col transition duration-300 group w-max"
										to={
											opponent == OPPONENT.AWAY
												? `/teams/${gameData.away.id}`
												: `/teams/${gameData.home.id}`
										}
									>
										{opponent == OPPONENT.AWAY
											? selectedSeasonTeamsQuerySnapshot?.docs
													.find((team) => team.id === gameData.away.id)
													?.data().name
											: selectedSeasonTeamsQuerySnapshot?.docs
													.find((team) => team.id === gameData.home.id)
													?.data().name}
										<span className="max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
									</Link>
								</div>
							</TeamRecord.Row>
						)
					})}
				</TeamRecord.Root>
				{historyQuerySnapshot && (
					<TeamHistory historyQuerySnapshot={historyQuerySnapshot} />
				)}
			</div>
		</div>
	)
}
