import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import {
	CheckCircledIcon,
	ExclamationTriangleIcon,
	ReloadIcon,
} from '@radix-ui/react-icons'
import { useContext } from 'react'
import { TeamsContext } from '@/firebase/teams-context'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { GradientHeader } from './gradient-header'

export const Teams = () => {
	const {
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	} = useContext(TeamsContext)

	const navigate = useNavigate()

	return (
		<div className={'container'}>
			<GradientHeader>Teams</GradientHeader>
			{teamsQuerySnapshotLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
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
													'w-full h-full max-w-[250px] max-h-[250px] transition duration-300 bg-muted group-hover:scale-105 mx-auto object-contain'
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
			) : (
				<div>No Teams Data</div>
			)}
		</div>
	)
}
