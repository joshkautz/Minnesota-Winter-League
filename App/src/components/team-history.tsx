import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotificationCard } from './notification-card'
import { teamsHistoryQuery } from '@/firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Skeleton } from './ui/skeleton'
import { useSeasonsContext } from '@/firebase/seasons-context'

const formatPlacement = (placement: number) => {
	switch (placement) {
		case 1:
			return '1st'
		case 2:
			return '2nd'
		case 3:
			return '3rd'
		default:
			return `${placement}th`
	}
}

export const TeamHistory = () => {
	const { id } = useParams()
	const [teamsQuerySnapshot] = useCollection(teamsHistoryQuery(id))
	const {
		seasonsQuerySnapshot,
		selectedSeasonQueryDocumentSnapshot /*TODO: Change this name to selectedSeasonQueryDocumentSnapshot. And ADD a new variable in context for currentSeasonQueryDocumentSnapshot*/,
	} = useSeasonsContext()

	const [teamProfileImageLoaded, setTeamProfileImageLoaded] = useState(false)

	const team = useMemo(
		() =>
			teamsQuerySnapshot?.docs.find(
				(team) =>
					team.data().season.id === selectedSeasonQueryDocumentSnapshot?.id
			),
		[teamsQuerySnapshot, selectedSeasonQueryDocumentSnapshot]
	)

	// TODO: Default to the current/latest season for team name when showing history.

	const [imgSrc, setImgSrc] = useState<string | undefined>()

	useEffect(() => {
		setImgSrc(team?.data().logo + `&date=${Date.now()}`)
	}, [team])

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
					title={'History'}
					description={`${team?.data().name} past seasons`}
					className={'flex-1 basis-[360px] flex-shrink-0'}
				>
					{teamsQuerySnapshot?.docs.map((teamsQueryDocumentSnapshot) => (
						<span key={`${teamsQueryDocumentSnapshot.id}`}>
							<p>
								{
									seasonsQuerySnapshot?.docs
										.find(
											(seasonQueryDocumentSnapshot) =>
												seasonQueryDocumentSnapshot.id ==
												teamsQueryDocumentSnapshot.data().season.id
										)
										?.data().name
								}
								{' - '}
								{teamsQueryDocumentSnapshot.data().name}
								{' - '}
								{formatPlacement(teamsQueryDocumentSnapshot.data().placement)}
							</p>
						</span>
					))}
				</NotificationCard>
			</div>
		</div>
	)
}
