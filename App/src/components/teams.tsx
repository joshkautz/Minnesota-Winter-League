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
import { Card, CardContent, CardHeader } from './ui/card'
import { useCount } from '@/lib/use-count'
import { ExtendedTeamData } from '@/lib/interfaces'

export const Teams = () => {
	const {
		teamsQuerySnapshot,
		teamsQuerySnapshotLoading,
		teamsQuerySnapshotError,
	} = useContext(TeamsContext)

	const [extendedTeamsData, extendedTeamsDataLoading] =
		useCount(teamsQuerySnapshot)

	const navigate = useNavigate()

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-min mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300'
				}
			>
				Teams
			</div>
			{teamsQuerySnapshotLoading || extendedTeamsDataLoading ? (
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
			) : extendedTeamsData && extendedTeamsData.length > 0 ? (
				<div className={'flex flex-row flex-wrap justify-evenly gap-y-8'}>
					{extendedTeamsData.map((team: ExtendedTeamData) => {
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
												src={team.logo}
												className={
													'h-auto w-auto object-contain transition duration-300 bg-muted group-hover:scale-105 aspect-square'
												}
											/>
										</div>
									</CardHeader>
									<CardContent
										className={'flex flex-col items-center justify-center pt-6'}
									>
										<p className={'flex flex-col'}>
											{team.name}
											<span
												className={
													'max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary'
												}
											></span>
										</p>
										<p
											className={cn(
												team.registeredCount < 10
													? 'text-destructive'
													: 'text-green-600 dark:text-green-500'
											)}
										>
											<i>
												{team.registeredCount > 10 ? (
													`Roster Minimum Not Met`
												) : (
													<div className="inline-flex items-center gap-2 text-green-600 dark:text-green-500">
														Complete <CheckCircledIcon className="w-4 h-4" />
													</div>
												)}
											</i>
										</p>
									</CardContent>
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
