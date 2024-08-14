import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useSeasonContext } from '@/firebase/season-context'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'

export const SeasonSelect = () => {
	const {
		selectedSeason,
		setSelectedSeason,
		seasonsQuerySnapshot,
		seasonsQuerySnapshotLoading,
	} = useSeasonContext()

	const [stringValue, setStringValue] = useState<string | undefined>(undefined)
	const [isLoaded, setIsLoaded] = useState(false)

	const handleSeasonChange = (season: string) => {
		setStringValue(season)
		const seasonDoc = seasonsQuerySnapshot?.docs.find(
			(doc) => doc.data().name === season
		)
		if (seasonDoc) {
			setSelectedSeason(seasonDoc)
		}
	}

	useEffect(() => {
		if (!seasonsQuerySnapshotLoading && selectedSeason && !isLoaded) {
			setStringValue(selectedSeason.data().name)
			setIsLoaded(true)
		}
	}, [seasonsQuerySnapshotLoading, selectedSeason, isLoaded])

	return (
		<div className="inline-flex items-center justify-center py-16 space-x-2">
			<p>Season</p>
			{seasonsQuerySnapshotLoading ? (
				<Skeleton className="w-24 h-8" />
			) : (
				<Select value={stringValue} onValueChange={handleSeasonChange}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{seasonsQuerySnapshot?.docs.map((season) => (
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
