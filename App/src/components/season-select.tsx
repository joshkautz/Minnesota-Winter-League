import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useSeasonsContext } from '@/contexts/seasons-context'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'

export const SeasonSelect = ({
	handleCloseMobileNav,
}: {
	handleCloseMobileNav?: () => void
}) => {
	const {
		selectedSeasonQueryDocumentSnapshot,
		setSelectedSeasonQueryDocumentSnapshot,
		seasonsQuerySnapshot,
		seasonsQuerySnapshotLoading,
	} = useSeasonsContext()

	const [stringValue, setStringValue] = useState<string | undefined>(undefined)

	const handleSeasonChange = (season: string) => {
		setStringValue(season)
		const seasonDoc = seasonsQuerySnapshot?.docs.find(
			(doc) => doc.data().name === season
		)
		if (seasonDoc) {
			setSelectedSeasonQueryDocumentSnapshot(seasonDoc)
		}
	}

	useEffect(() => {
		if (selectedSeasonQueryDocumentSnapshot) {
			setStringValue(selectedSeasonQueryDocumentSnapshot.data().name)
		}
		if (handleCloseMobileNav) {
			console.log('handleClose is firing')
			handleCloseMobileNav()
		}
	}, [selectedSeasonQueryDocumentSnapshot])

	return (
		<div className="inline-flex items-center justify-center space-x-2">
			{seasonsQuerySnapshotLoading ? (
				<Skeleton className="w-24 h-8" />
			) : (
				<Select value={stringValue} onValueChange={handleSeasonChange}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{seasonsQuerySnapshot?.docs
							.sort(
								(a, b) =>
									b.data().dateStart.seconds - a.data().dateStart.seconds
							)
							.map((season) => (
								<SelectItem key={season.id} value={season.data().name}>
									{season.data().name}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			)}
		</div>
	)
}
