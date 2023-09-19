import {
	DocumentReference,
	DocumentData,
	promoteToCaptain,
	removePlayerFromTeam,
} from '@/firebase/firestore'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
} from './ui/dropdown-menu'
import { DotsVerticalIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { AuthContext } from '@/firebase/auth-context'
import { PlayerData } from '@/lib/interfaces'
import { useDocument } from 'react-firebase-hooks/firestore'

export const TeamRosterPlayer = ({
	playerRef,
	isDisabled,
}: {
	playerRef: DocumentReference<PlayerData, DocumentData>
	isDisabled: boolean
}) => {
	const { documentSnapshot } = useContext(AuthContext)

	const [playerSnapshot] = useDocument(playerRef)

	const promoteToCaptainOnClickHandler = async () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				promoteToCaptain(playerRef, data.team)
			}
		}
	}

	const removeFromTeamOnClickHandler = async () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				removePlayerFromTeam(playerRef, data.team)
			}
		}
	}

	return (
		<div>
			{playerSnapshot ? (
				<div className="flex items-end gap-2 py-2">
					<div className="flex flex-row items-center">
						<p className="mr-2">
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
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size={'sm'} variant={'ghost'}>
										<DotsVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className={'w-56'}>
									<DropdownMenuLabel>More actions</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											disabled={isDisabled || playerSnapshot.data()?.captain}
											onClick={promoteToCaptainOnClickHandler}
										>
											Promote to captain
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isDisabled || playerSnapshot.data()?.captain}
											onClick={removeFromTeamOnClickHandler}
										>
											Remove from team
										</DropdownMenuItem>
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
