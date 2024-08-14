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

	return (
		<div className="inline-flex items-center justify-center py-16 space-x-2">
			<p>Season</p>

			<Select>
				<SelectTrigger>
					<SelectValue
						defaultValue={selectedSeason?.data().name}
						placeholder={'Select a season'}
					/>
				</SelectTrigger>
				<SelectContent>
					{seasonsQuerySnapshot?.docs.map((season) => (
						<SelectItem
							key={season.id}
							value={season.data().name}
							onClick={() => setSelectedSeason(season)}
						>
							{season.data().name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
