import { useMemo } from 'react'
import { NotificationCard } from '../notification-card'
import { DocumentData, QuerySnapshot } from '@/firebase/firestore'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { TeamData } from '@/lib/interfaces'

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

export const TeamHistory = ({
	historyQuerySnapshot,
}: {
	historyQuerySnapshot: QuerySnapshot<TeamData, DocumentData>
}) => {
	const {
		seasonsQuerySnapshot,
		selectedSeasonQueryDocumentSnapshot /*TODO: Change this name to selectedSeasonQueryDocumentSnapshot. And ADD a new variable in context for currentSeasonQueryDocumentSnapshot*/,
	} = useSeasonsContext()

	const team = useMemo(
		() =>
			historyQuerySnapshot?.docs.find(
				(team) =>
					team.data().season.id === selectedSeasonQueryDocumentSnapshot?.id
			),
		[historyQuerySnapshot, selectedSeasonQueryDocumentSnapshot]
	)

	return (
		<NotificationCard
			title={'History'}
			description={`${team?.data().name} past seasons`}
			className={'flex-1 basis-[360px] flex-shrink-0'}
		>
			{historyQuerySnapshot?.docs.map((historyQueryDocumentSnapshot) => (
				<span key={`${historyQueryDocumentSnapshot.id}`}>
					<p>
						{
							seasonsQuerySnapshot?.docs
								.find(
									(seasonQueryDocumentSnapshot) =>
										seasonQueryDocumentSnapshot.id ==
										historyQueryDocumentSnapshot.data().season.id
								)
								?.data().name
						}
						{' - '}
						{historyQueryDocumentSnapshot.data().name}
						{' - '}
						{formatPlacement(historyQueryDocumentSnapshot.data().placement)}
					</p>
				</span>
			))}
		</NotificationCard>
	)
}
