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
import { toCamelCase } from '@/lib/utils'

export const sampleData = [
	{
		teamName: 'The Fighting Crabs',
		teamImage:
			'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/f/fight-crab-switch/description-image',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
	{
		teamName: 'Angry Moose Friends',
		teamImage:
			'https://st5.depositphotos.com/2927609/65112/v/450/depositphotos_651121230-stock-illustration-deer-logo-design-cute-angry.jpg',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
	{
		teamName: 'Killer Bees',
		teamImage:
			'https://assets.pokemon.com/assets/cms2/img/pokedex/full/015.png',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
	{
		teamName: 'Sad Boy Frogs',
		teamImage: 'https://m.media-amazon.com/images/I/61UhhuendiS.jpg',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
	{
		teamName: 'Lucky Duck Gang',
		teamImage:
			'https://i.pinimg.com/1200x/5e/94/cd/5e94cda047e50cd6e02a3333417199eb.jpg',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
	{
		teamName: 'Philosopher Wolf',
		teamImage:
			'https://st2.depositphotos.com/1807998/10717/v/950/depositphotos_107171036-stock-illustration-hipster-wolf-portrait-with-glasses.jpg',
		win: Math.floor(Math.random() * 11),
		loss: Math.floor(Math.random() * 11),
		pointsFor: Math.floor(Math.random() * 51),
		pointsAgainst: Math.floor(Math.random() * 51),
	},
]

export const Standings = () => {
	const sortedData = sampleData.sort((a, b) => b.win - a.win || a.loss - b.loss)

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
			<div
				className={
					'max-w-min my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Standings
			</div>
			<Table>
				<TableCaption>2023 winter league team standings.</TableCaption>
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
					{sortedData.map(
						(
							{ teamImage, teamName, win, loss, pointsAgainst, pointsFor },
							index
						) => {
							const plusMinus = pointsFor - pointsAgainst
							return (
								<TableRow key={index}>
									<TableCell className="font-medium">{index + 1}</TableCell>
									<TableCell>
										<Link to={`/teams/${toCamelCase(teamName)}`}>
											<div className="flex items-center justify-start gap-2">
												<img className="w-auto h-8" src={teamImage} />
												<span>{teamName}</span>
											</div>
										</Link>
									</TableCell>
									<TableCell>{win}</TableCell>
									<TableCell>{loss}</TableCell>
									<TableCell className={getColor(plusMinus)}>
										{plusMinus}
									</TableCell>
								</TableRow>
							)
						}
					)}
				</TableBody>
			</Table>
		</div>
	)
}
