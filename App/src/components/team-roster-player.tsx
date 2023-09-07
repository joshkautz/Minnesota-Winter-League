import {
	DocumentReference,
	DocumentData,
	getPlayerData,
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
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export const TeamRosterPlayer = ({
	playerRef,
	isDisabled,
}: {
	playerRef: DocumentReference
	isDisabled: boolean
}) => {
	const [playerData, setPlayerData] = useState<DocumentData | null | undefined>(
		null
	)

	useEffect(() => {
		async function fetchPlayerData() {
			try {
				const data = await getPlayerData(playerRef)
				setPlayerData(data.data())
			} catch (error) {
				console.error('Error fetching player data:', error)
			}
		}

		fetchPlayerData()
	}, [playerRef])

	return (
		<div>
			{playerData ? (
				<div className="flex items-end gap-2 py-2">
					<div className="mr-2">
						<p>
							{playerData.firstname} {playerData.lastname}
						</p>
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
									<DropdownMenuItem disabled={isDisabled}>
										Promote to captain
									</DropdownMenuItem>
									<DropdownMenuItem disabled={isDisabled}>
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
