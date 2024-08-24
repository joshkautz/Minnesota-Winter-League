import { NotificationCard } from '../notification-card'
import {
	DocumentData,
	DocumentSnapshot,
	QuerySnapshot,
} from '@/firebase/firestore'
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
		case null:
			return 'TBD'
		default:
			return `${placement}th`
	}
}

export const TeamHistory = ({
	teamDocumentSnapshot,
	historyQuerySnapshot,
}: {
	teamDocumentSnapshot: DocumentSnapshot<TeamData, DocumentData> | undefined
	historyQuerySnapshot: QuerySnapshot<TeamData, DocumentData>
}) => {
	const { seasonsQuerySnapshot } = useSeasonsContext()

	return (
		<NotificationCard
			title={'History'}
			description={`${teamDocumentSnapshot?.data()?.name} past seasons`}
			className={'flex-1 basis-[360px] flex-shrink-0'}
		>
			{historyQuerySnapshot?.docs
				.sort((a, b) => {
					const docs = seasonsQuerySnapshot?.docs
					if (docs) {
						const seasonA = docs.find(
							(season) => season.id === a.data().season.id
						)
						const seasonB = docs.find(
							(season) => season.id === b.data().season.id
						)
						if (seasonA && seasonB) {
							return (
								seasonB.data()?.dateStart.seconds -
								seasonA.data()?.dateStart.seconds
							)
						}
						return 0
					}
					return 0
				})
				.map((historyQueryDocumentSnapshot) => (
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
