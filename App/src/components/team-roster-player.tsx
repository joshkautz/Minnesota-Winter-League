import {
	DocumentReference,
	DocumentData,
	promoteToCaptain,
	leaveTeam,
	demoteFromCaptain,
} from '@/firebase/firestore'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from './ui/dropdown-menu'
import { DotsVerticalIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { useContext, useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { AuthContext } from '@/firebase/auth-context'
import { PlayerData } from '@/lib/interfaces'
import { useDocument } from 'react-firebase-hooks/firestore'
import { DestructiveConfirmationDialog } from './destructive-confirmation-dialog'
import { toast } from './ui/use-toast'
import { Badge } from './ui/badge'

export const TeamRosterPlayer = ({
	playerRef,
	isDisabled,
}: {
	playerRef: DocumentReference<PlayerData, DocumentData>
	isDisabled: boolean
}) => {
	const { documentSnapshot } = useContext(AuthContext)
	const [playerSnapshot] = useDocument(playerRef)
	const [leaveTeamLoading, setLeaveTeamLoading] = useState(false)

	const demoteFromCaptainOnClickHandler = async () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				demoteFromCaptain(playerRef, data.team)
					.then(() => {
						toast({
							title: `${
								playerSnapshot?.data()?.firstname ?? 'Player'
							} is no longer a team captain`,
							description: `They are still on your roster. You may be promote them back at any time.`,
						})
					})
					.catch((error) => {
						console.log(error.message)
						toast({
							title: 'Unable to Demote',
							description: error.message,
							variant: 'destructive',
						})
					})
			}
		}
	}

	const promoteToCaptainOnClickHandler = async () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				promoteToCaptain(playerRef, data.team)
					.then(() => {
						toast({
							title: 'Congratulations',
							description: `${
								playerSnapshot?.data()?.firstname ?? 'Player'
							} has been promoted to team captain.`,
						})
					})
					.catch(() => {
						toast({
							title: 'Unable to Promote',
							description: 'Something went wrong. Please try again later.',
							variant: 'destructive',
						})
					})
			}
		}
	}

	const removeFromTeamOnClickHandler = async () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				leaveTeam(playerRef, data.team, setLeaveTeamLoading)
					.then(() => {
						toast({
							title: `${
								playerSnapshot?.data()?.firstname ?? 'Player'
							} has left the team`,
							description: 'Send player invites to build up your roster.',
						})
					})
					.catch((error) => {
						toast({
							title: 'Unable to Remove',
							description: error.message,
							variant: 'destructive',
						})
					})
			}
		}
	}

	return (
		<div>
			{playerSnapshot ? (
				<div className="flex items-end gap-2 py-2">
					<div className="flex flex-row items-center">
						<p className="mr-2 select-none">
							{playerSnapshot.data()?.firstname}{' '}
							{playerSnapshot.data()?.lastname}{' '}
						</p>
						{playerSnapshot.data()?.captain && (
							<StarFilledIcon className="text-primary" />
						)}
					</div>
					{/* If not a captain, no need to show */}
					{!isDisabled && (
						<div className="flex justify-end flex-1 gap-2">
							<div className="flex items-center">
								<Badge
									className={'select-none hover:bg-initial'}
									variant={
										playerSnapshot.data()?.registered ? 'secondary' : 'inverse'
									}
								>
									{playerSnapshot.data()?.registered
										? 'registered'
										: 'unregistered'}
								</Badge>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size={'sm'} variant={'ghost'}>
										<DotsVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className={'w-56'}>
									<DropdownMenuGroup>
										<DropdownMenuItem
											disabled={isDisabled || !playerSnapshot.data()?.captain}
											onClick={demoteFromCaptainOnClickHandler}
										>
											Demote from captain
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isDisabled || playerSnapshot.data()?.captain}
											onClick={promoteToCaptainOnClickHandler}
										>
											Promote to captain
										</DropdownMenuItem>
										<DestructiveConfirmationDialog
											title={
												playerSnapshot.id == documentSnapshot?.id
													? 'Are you sure you want to leave?'
													: 'Are you sure?'
											}
											description={
												playerSnapshot.id == documentSnapshot?.id
													? 'You will not be able to rejoin until a captain accepts you back on to the roster.'
													: `${playerSnapshot.data()
															?.firstname} will not be able to rejoin until a captain accepts them back on to the roster.`
											}
											onConfirm={removeFromTeamOnClickHandler}
										>
											<DropdownMenuItem
												className="focus:bg-destructive focus:text-destructive-foreground"
												disabled={isDisabled || leaveTeamLoading}
												onClick={(event) => event.preventDefault()}
											>
												Remove from team
											</DropdownMenuItem>
										</DestructiveConfirmationDialog>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<Skeleton className="h-4 w-[250px]" />
					</div>
				</div>
			)}
		</div>
	)
}
