import { Link } from 'react-router-dom'
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from './ui/table'
import { useContext } from 'react'
import { TeamsContext } from '@/firebase/teams-context'
import { standingsQuery } from '@/firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { ReloadIcon } from '@radix-ui/react-icons'
import { GradientHeader } from './gradient-header'
import { ComingSoon } from './coming-soon'
import { cn } from '@/lib/utils'

export const Standings = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	const [standingsSnapshot, standingsSnapshotLoading, standingsSnapshotError] =
		useCollection(standingsQuery())

	const getColor = (value: number) => {
		if (value > 9) {
			return 'text-green-600'
		}
		if (value < -9) {
			return 'text-destructive'
		}
		return ''
	}

	return (
		<div className="container">
			<GradientHeader>Standings</GradientHeader>
			{standingsSnapshotLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : standingsSnapshotError ? (
				'Error'
			) : standingsSnapshot?.size === 0 ? (
				<ComingSoon
					message={
						'Full team standings will become available as soon as the registration period ends.'
					}
				/>
			) : (
				<Table>
					<TableCaption></TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Team</TableHead>
							<TableHead>W</TableHead>
							<TableHead>L</TableHead>
							<TableHead>+/-</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{standingsSnapshot?.docs.map((standing, index) => {
							const team = teamsQuerySnapshot?.docs.find(
								(team) => team.id === standing.id
							)
							const teamData = teamsQuerySnapshot?.docs
								.find((team) => team.id === standing.id)
								?.data()
							return (
								<TableRow key={index}>
									<TableCell className="font-medium ">{index + 1}</TableCell>
									<TableCell>
										<Link to={`/teams/${team?.id}`}>
											<div className="flex items-center justify-start gap-2 ">
												<div className="flex justify-start w-16">
													<img
														className={cn(
															'w-8 h-8 rounded-full object-cover bg-muted',
															!teamData?.logo &&
																'bg-gradient-to-r from-primary to-sky-300'
														)}
														src={teamData?.logo}
													/>
												</div>
												<span>{teamData?.name}</span>
											</div>
										</Link>
									</TableCell>
									<TableCell>{standing.data()?.wins}</TableCell>
									<TableCell>{standing.data()?.losses}</TableCell>
									<TableCell
										className={getColor(
											standing.data()?.pointsFor -
												standing.data()?.pointsAgainst
										)}
									>
										{standing.data()?.pointsFor -
											standing.data()?.pointsAgainst}
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
