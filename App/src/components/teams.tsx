import { Link } from 'react-router-dom'
import { toCamelCase } from '@/lib/utils'
import { useTeams } from '@/hooks/use-teams'
import { Button } from './ui/button'

export const Teams = () => {
	const { teams, isLoading, error, refetch } = useTeams()

	return (
		<div className="container">
			<div
				className={
					'max-w-min mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Teams
			</div>
			{isLoading && <div>Loading...</div>}
			{error && (
				<div>
					Something went wrong <Button onClick={refetch}>click to retry</Button>
				</div>
			)}
			{teams && (
				<div className="flex flex-row flex-wrap justify-evenly">
					{teams.map(({ id, name, logo }) => {
						console.log(logo)
						return (
							<div
								key={id}
								className="group relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center"
							>
								<Link
									className="w-full h-full"
									to={`/teams/${toCamelCase(name)}`}
								>
									<img
										className="h-auto w-auto max-w-[180px] sm:max-w-[275px] max-h-[200px] mx-auto"
										src={logo}
									/>
								</Link>
								<span className="absolute bottom-0 left-0 font-medium text-center transition-all duration-300 opacity-0 min-w-max right-2/3 text-primary group-hover:right-0 group-hover:opacity-100 ">
									{name}
								</span>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
