import { Link } from 'react-router-dom'
import { toCamelCase } from '@/lib/utils'
import { useTeams } from '@/hooks/use-teams'
import { Button } from './ui/button'

const LoadingState = () => {
	return (
		<div className="flex flex-row flex-wrap justify-evenly">
			{[1, 2, 3, 4].map((placeholder) => (
				<div
					key={placeholder}
					className="ring animate-pulse relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center"
				>
					<div className="bg-gray-200 h-[200px] w-[100%] sm:w-[275px] max-w-[180px] sm:max-w-[275px]"></div>
				</div>
			))}
		</div>
	)
}

const EmptyState = () => {
	return <div>No Teams Data</div>
}

export const Teams = () => {
	const { teams, isLoading, error, refetch } = useTeams()

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-min mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Teams
			</div>
			{isLoading ? (
				<LoadingState />
			) : error ? (
				// offer refetch option here
				<div>
					Something went wrong <Button onClick={refetch}>click to retry</Button>
				</div>
			) : teams.length > 0 ? (
				<div className={'flex flex-row flex-wrap justify-evenly'}>
					{teams.map(({ id, name, logo }) => {
						return (
							<div
								key={id}
								className={
									'ring group relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center'
								}
							>
								<Link
									className={'min-w-full'}
									to={`/teams/${toCamelCase(name)}`}
								>
									<img
										className={
											'ring h-auto w-auto max-w-[180px] sm:max-w-[275px] max-h-[200px] mx-auto'
										}
										src={logo}
									/>
								</Link>
								<span
									className={
										'absolute left-0 text-sm font-semibold text-center transition-all duration-300 opacity-0 sm:text-base bottom-2 sm:bottom-0 min-w-max right-2/3 text-primary group-hover:right-0 group-hover:opacity-100'
									}
								>
									{name}
								</span>
							</div>
						)
					})}
				</div>
			) : (
				// no loading, no error, but also no teams...
				<EmptyState />
			)}
		</div>
	)
}
