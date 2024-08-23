import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { CheckCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useTeamsContext } from '@/firebase/teams-context'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { GradientHeader } from '../gradient-header'
import { ComingSoon } from '../coming-soon'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { Timestamp } from '@firebase/firestore'

export const Teams = () => {
	const { selectedSeasonTeamsQuerySnapshot } = useTeamsContext()
	const { selectedSeasonQueryDocumentSnapshot } = useSeasonsContext()

	return (
		<div className={'container'}>
			<GradientHeader>Teams</GradientHeader>
			{/* Season Registration window is in the future */}
			{selectedSeasonQueryDocumentSnapshot &&
				selectedSeasonQueryDocumentSnapshot.data().registrationStart.seconds >
					Timestamp.now().seconds && (
					<>
						Registration for this season will begin on{' '}
						{
							selectedSeasonQueryDocumentSnapshot.data().registrationStart
								.seconds
						}
						.
					</>
				)}
			{/* Season Registration window is live */}
			{selectedSeasonQueryDocumentSnapshot &&
				selectedSeasonQueryDocumentSnapshot.data().registrationStart.seconds <
					Timestamp.now().seconds &&
				selectedSeasonQueryDocumentSnapshot.data().registrationEnd.seconds >
					Timestamp.now().seconds && (
					<>
						Registration for this season is live. Go create a team or join a
						team!
					</>
				)}
			{!selectedSeasonTeamsQuerySnapshot ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : selectedSeasonTeamsQuerySnapshot.docs.length == 0 ? (
				<ComingSoon
					message={
						'There are no teams to display. Please wait for the registration period to start on October 1st, 2024.'
					}
				/>
			) : (
				<div
					className={'flex flex-row flex-wrap justify-center gap-y-8 gap-x-8'}
				>
					{selectedSeasonTeamsQuerySnapshot.docs.map((team) => {
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
												className={cn(
													'w-full h-full max-w-[250px] max-h-[250px] transition duration-300 bg-muted group-hover:scale-105 mx-auto object-cover',
													!team.data().logo &&
														'bg-gradient-to-r from-primary to-sky-300 border-0 scale-[1.05]'
												)}
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
												<div className="inline-flex items-center gap-2 text-green-600 dark:text-green-500">
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
			)}
		</div>
	)
}
