import {
	DocumentReference,
	DocumentData,
	getPlayerSnapshot,
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
import { useState, useEffect, useContext } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { AuthContext } from '@/firebase/auth-context'
import { PlayerData } from '@/lib/interfaces'

export const TeamRosterPlayer = ({
	playerRef,
	isDisabled,
}: {
	playerRef: DocumentReference<PlayerData, DocumentData>
	isDisabled: boolean
}) => {
	const { documentSnapshot } = useContext(AuthContext)

	const [playerData, setPlayerData] = useState<PlayerData | null | undefined>()

	useEffect(() => {
		async function fetchPlayerData() {
			try {
				const data = await getPlayerSnapshot(playerRef)
				setPlayerData(data.data())
			} catch (error) {
				console.error('Error fetching player data:', error)
			}
		}

		fetchPlayerData()
	}, [playerRef])

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
			{playerData ? (
				<div className="flex items-end gap-2 py-2">
					<div className="flex flex-row items-center">
						<p className="mr-2">
							{playerData.firstname} {playerData.lastname}{' '}
						</p>
						{playerData.captain && <StarFilledIcon className="text-primary" />}
					</div>
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
									<DropdownMenuItem>View profile</DropdownMenuItem>
									<DropdownMenuItem
										disabled={isDisabled || playerData.captain}
										onClick={promoteToCaptainOnClickHandler}
									>
										Promote to captain
									</DropdownMenuItem>
									<DropdownMenuItem
										disabled={isDisabled || playerData.captain}
										onClick={removeFromTeamOnClickHandler}
									>
										Remove from team
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
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
