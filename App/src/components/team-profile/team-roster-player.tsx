import { DocumentReference, DocumentData } from '@/firebase/firestore'

import { StarFilledIcon } from '@radix-ui/react-icons'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { PlayerData } from '@/lib/interfaces'
import { useDocument } from 'react-firebase-hooks/firestore'
import { Badge } from '@/components/ui/badge'
import { useSeasonsContext } from '@/firebase/seasons-context'

export const TeamRosterPlayer = ({
	playerRef,
}: {
	playerRef: DocumentReference<PlayerData, DocumentData>
}) => {
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()
	const [playerSnapshot] = useDocument(playerRef)

	const isPlayerCaptain = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find(
					(item) => item.season.id === selectedSeasonQueryDocumentSnapshot?.id
				)?.captain,
		[playerSnapshot, selectedSeasonQueryDocumentSnapshot]
	)

	const isPlayerPaid = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find(
					(item) => item.season.id === selectedSeasonQueryDocumentSnapshot?.id
				)?.paid,
		[playerSnapshot, selectedSeasonQueryDocumentSnapshot]
	)

	const isPlayerSigned = useMemo(
		() =>
			playerSnapshot
				?.data()
				?.seasons.find(
					(item) => item.season.id === selectedSeasonQueryDocumentSnapshot?.id
				)?.signed,
		[playerSnapshot, selectedSeasonQueryDocumentSnapshot]
	)

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
