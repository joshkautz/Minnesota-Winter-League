import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useSeasonContext } from '@/firebase/season-context'

export const SeasonSelect = () => {
	const { selectedSeason, setSelectedSeason, seasonsQuerySnapshot } =
		useSeasonContext()

	const handleSeasonChange = (season: string) => {
		const seasonDoc = seasonsQuerySnapshot?.docs.find(
			(doc) => doc.data().name === season
		)
		if (seasonDoc) {
			setSelectedSeason(seasonDoc)
		}
	}

	return (
		<div className="inline-flex items-center justify-center py-16 space-x-2">
			<p>Season</p>

			<Select onValueChange={handleSeasonChange}>
				<SelectTrigger>
					<SelectValue
						defaultValue={selectedSeason?.data().name}
						placeholder={'Select a season'}
					/>
				</SelectTrigger>
				<SelectContent>
					{seasonsQuerySnapshot?.docs.map((season) => (
						<SelectItem key={season.id} value={season.data().name}>
							{season.data().name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
