import { Link } from 'react-router-dom'
import { sampleData } from './standings'
import { toCamelCase } from '@/lib/utils'

export const Teams = () => {
	return (
		<div className="container">
			<div
				className={
					'max-w-min mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Teams
			</div>
			<div className="flex flex-row flex-wrap justify-evenly">
				{sampleData.map(({ teamImage, teamName }) => {
					return (
						<div className="group relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center">
							<Link to={`/teams/${toCamelCase(teamName)}`}>
								<img
									className="h-auto w-auto max-w-[180px] sm:max-w-[275px] max-h-[200px] mx-auto"
									src={teamImage}
								/>
							</Link>
							<span className="absolute bottom-0 left-0 font-medium text-center transition-all duration-300 opacity-0 min-w-max right-2/3 text-primary group-hover:right-0 group-hover:opacity-100 ">
								{teamName}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
