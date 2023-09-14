import { useContext } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import { TeamsContext } from '@/firebase/teams-context'

interface OpponentDetails {
	logo?: string
	score: number | null
}

const ScheduleCard = ({
	gameDetails,
	title,
}: {
	gameDetails: {
		status: string
		opponentOne: OpponentDetails
		opponentTwo: OpponentDetails
	}[]
	title: string
}) => {
	return (
		<Card className={'flex-1 flex-shrink-0 basis-80'}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>Saturday, 11/24</CardDescription>
			</CardHeader>
			<CardContent>
				{gameDetails.map((game, index) => (
					<div
						key={`schedule-row-${index}`}
						className={'flex items-center justify-start max-h-10'}
					>
						<div className={'flex-[1]'}>Field {index + 1}</div>
						<div className={'flex-[4] flex justify-center gap-4 items-center'}>
							<div className={'flex-1'}>
								<img
									className={'mx-auto max-h-10'}
									src={game.opponentOne.logo}
								/>
							</div>
							<p className={'flex-1  text-center'}>
								{game.status === 'pending'
									? 'vs'
									: `${game.opponentOne.score} - ${game.opponentTwo.score}`}
							</p>
							<div className={'items-center flex-1'}>
								<img
									className={'mx-auto max-h-10'}
									src={game.opponentTwo.logo}
								/>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

export const Schedule = () => {
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	const sampleData = [
		[
			{
				status: 'completed',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[0].data().logo,
					score: 11,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: 15,
				},
			},
			{
				status: 'completed',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: 12,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[3].data().logo,
					score: 13,
				},
			},
			{
				status: 'completed',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: 15,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: 8,
				},
			},
		],
		[
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[0].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: null,
				},
			},
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[3].data().logo,
					score: null,
				},
			},
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: null,
				},
			},
		],
		[
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[0].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: null,
				},
			},
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[3].data().logo,
					score: null,
				},
			},
			{
				status: 'pending',
				opponentOne: {
					logo: teamsQuerySnapshot?.docs[1].data().logo,
					score: null,
				},
				opponentTwo: {
					logo: teamsQuerySnapshot?.docs[2].data().logo,
					score: null,
				},
			},
		],
	]
	return (
		<div className="container">
			<div
				className={
					'my-4 max-w-max text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Schedule
			</div>
			<div className={'flex flex-wrap gap-8'}>
				{sampleData.map((data, index) => (
					<ScheduleCard
						key={`schedule-card-${index}`}
						gameDetails={data}
						title={`Week ${index + 1}`}
					/>
				))}
			</div>
		</div>
	)
}
