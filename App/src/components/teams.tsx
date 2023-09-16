import { Link, useNavigate } from 'react-router-dom'
import { cn, toCamelCase } from '@/lib/utils'
import { Button } from './ui/button'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { TeamsContext } from '@/firebase/teams-context'
import { Card, CardContent, CardHeader } from './ui/card'

const LoadingState = () => {
	return (
		<div className={'flex flex-row flex-wrap justify-evenly'}>
			{[1, 2, 3, 4].map((placeholder) => (
				<div
					key={placeholder}
					className={
						'animate-pulse relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center'
					}
				>
					<div
						className={
							'bg-primary/10 rounded-md h-[200px] w-[100%] sm:w-[275px] max-w-[180px] sm:max-w-[275px]'
						}
					></div>
				</div>
			))}
		</div>
	)
}

const EmptyState = () => {
	return <div>No Teams Data</div>
}

export const Teams = () => {
	const {
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	} = useContext(TeamsContext)

	const navigate = useNavigate()

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-min mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Teams
			</div>
			{teamsQuerySnapshotLoading ? (
				<LoadingState />
			) : teamsQuerySnapshotError ? (
				// offer refetch option here
				<Alert className={cn('max-w-[600px] mx-auto')}>
					<ExclamationTriangleIcon className={'w-4 h-4'} />
					<AlertTitle>Unable to retrieve team data</AlertTitle>
					<AlertDescription>
						There was a connection issue on our end. Please try again. If this
						issue persists, contact{' '}
						<span className={'underline'}>mn winter league.</span>
					</AlertDescription>
					<div className={'flex justify-end gap-2 mt-2'}>
						<Button
							size={'sm'}
							variant={'outline'}
							onClick={() => navigate('/')}
						>
							Home
						</Button>
						<Button size={'sm'} onClick={() => {}}>
							Retry
						</Button>
					</div>
				</Alert>
			) : teamsQuerySnapshot && teamsQuerySnapshot.size > 0 ? (
				<div className={'flex flex-row flex-wrap justify-evenly gap-y-8'}>
					{teamsQuerySnapshot.docs.map((doc) => {
						return (
							<Link
								key={`link-${doc.id}`}
								to={`/teams/${doc.id}`}
							>
								<Card className={'group'}>
									<CardHeader className={'p-0'}>
										<div
											className={
												'w-[250px] h-[250px] overflow-hidden rounded-md rounded-b-none'
											}
										>
											<img
												src={doc.data().logo}
												className={
													'h-auto w-auto object-contain transition duration-300 bg-muted group-hover:scale-105 aspect-square'
												}
											/>
										</div>
									</CardHeader>
									<CardContent className={'flex items-end justify-center pt-6'}>
										<p className={'flex flex-col'}>
											{doc.data().name}
											<span
												className={
													'max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary'
												}
											></span>
										</p>
									</CardContent>
								</Card>
							</Link>
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
