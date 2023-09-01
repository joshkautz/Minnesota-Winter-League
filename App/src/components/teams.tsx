import { Link, useNavigate } from 'react-router-dom'
import { cn, toCamelCase } from '@/lib/utils'
import { Button } from './ui/button'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { TeamsContext } from '@/firebase/teams-context'

const LoadingState = () => {
	return (
		<div className="flex flex-row flex-wrap justify-evenly">
			{[1, 2, 3, 4].map((placeholder) => (
				<div
					key={placeholder}
					className="animate-pulse relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center"
				>
					<div className="bg-gray-100 h-[200px] w-[100%] sm:w-[275px] max-w-[180px] sm:max-w-[275px]"></div>
				</div>
			))}
		</div>
	)
}

const EmptyState = () => {
	return <div>No Teams Data</div>
}

export const Teams = () => {
	const { collectionDataSnapshot, collectionDataLoading, collectionDataError } =
		useContext(TeamsContext)

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
			{collectionDataLoading ? (
				<LoadingState />
			) : collectionDataError ? (
				// offer refetch option here
				<Alert className={cn('max-w-[600px] mx-auto')}>
					<ExclamationTriangleIcon className="w-4 h-4" />
					<AlertTitle>Unable to retrieve team data</AlertTitle>
					<AlertDescription>
						There was a connection issue on our end. Please try again. If this
						issue persists, contact{' '}
						<span className="underline">mn winter league.</span>
					</AlertDescription>
					<div className="flex justify-end gap-2 mt-2">
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
			) : collectionDataSnapshot && collectionDataSnapshot.size > 0 ? (
				<div className={'flex flex-row flex-wrap justify-evenly'}>
					{collectionDataSnapshot.docs.map((doc) => {
						return (
							<div
								key={doc.id}
								className={
									'group relative w-[180px] sm:w-[275px] h-[240px] flex items-center justify-center'
								}
							>
								<Link
									className={'min-w-full'}
									to={`/teams/${toCamelCase(doc.data().name)}`}
								>
									<img
										className={
											'h-auto w-auto max-w-[180px] sm:max-w-[275px] max-h-[200px] mx-auto'
										}
										src={doc.data().logo}
									/>
								</Link>
								<span
									className={
										'absolute left-0 text-sm font-semibold text-center transition-all duration-300 opacity-0 sm:text-base bottom-2 sm:bottom-0 min-w-max right-0 sm:right-2/3 text-primary sm:group-hover:right-0 group-hover:opacity-100'
									}
								>
									{doc.data().name}
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
