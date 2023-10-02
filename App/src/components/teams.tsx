import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { CheckCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { TeamsContext } from '@/firebase/teams-context'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { GradientHeader } from './gradient-header'

export const Teams = () => {
	const { teamsQuerySnapshot, teamsQuerySnapshotLoading } =
		useContext(TeamsContext)

	return (
		<div className={'container'}>
			<GradientHeader>Teams</GradientHeader>
			{teamsQuerySnapshotLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : (
				teamsQuerySnapshot &&
				teamsQuerySnapshot.size > 0 && (
					<div
						className={'flex flex-row flex-wrap justify-center gap-y-8 gap-x-8'}
					>
						{teamsQuerySnapshot.docs.map((team) => {
							return (
								<Link key={`link-${team.id}`} to={`/teams/${team.id}`}>
									<Card className={'group'}>
										<CardHeader className={'p-0'}>
											<div
												className={
													'w-[250px] h-[250px] overflow-hidden rounded-md rounded-b-none'
												}
											>
												<img
													src={team.data().logo}
													className={
														'w-full h-full max-w-[250px] max-h-[250px] transition duration-300 bg-muted group-hover:scale-105 mx-auto object-cover'
													}
												/>
											</div>
										</CardHeader>
										<CardContent
											className={
												'flex flex-col items-center justify-center pt-6 max-w-[250px] text-ellipsis flex-nowrap'
											}
										>
											<p className={'flex flex-col flex-nowrap text-ellipsis'}>
												<span className="text-ellipsis whitespace-nowrap">
													{team.data().name}
												</span>
												<span
													className={
														'max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary'
													}
												></span>
											</p>
										</CardContent>
										<CardFooter>
											<div
												className={cn(
													'text-muted-foreground italic text-sm items-center mx-auto text-center'
												)}
											>
												{!team.data().registered ? (
													<p>Registration in progress</p>
												) : (
													<div className="inline-flex items-center gap-2">
														Registered
														<CheckCircledIcon className="w-4 h-4" />
													</div>
												)}
											</div>
										</CardFooter>
									</Card>
								</Link>
							)
						})}
					</div>
				)
			)}
			{teamsQuerySnapshot && teamsQuerySnapshot.size < 12 && (
				<div className="flex flex-col items-center justify-center my-16">
					<div>
						<p>Not finding the team you are looking for? </p>
						<Link className="underline" to={'/create'}>
							Create your own
						</Link>
						<span> and invite your friends!</span>
					</div>
				</div>
			)}
		</div>
	)
}
