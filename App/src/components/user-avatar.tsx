import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthContext } from '@/firebase/auth-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { UserForm } from '@/components/user-form'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { OffersContext } from '@/firebase/offers-context'

export const UserAvatar = () => {
	const { authStateUser, authStateLoading, signOut } = useContext(AuthContext)
	const { incomingOffersQuerySnapshot } = useContext(OffersContext)

	const hasPendingOffers = incomingOffersQuerySnapshot?.docs.filter(
		(entry) => entry.data().status === 'pending'
	).length

	if (authStateLoading) {
		return <ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
	}

	if (!authStateUser) {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button variant={'default'}>Login</Button>
				</DialogTrigger>
				<DialogContent className={'sm:max-w-[425px] pt-10'}>
					<UserForm />
				</DialogContent>
			</Dialog>
		)
	}

	if (authStateUser) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className={'overflow-visible cursor-default'}>
						{!!hasPendingOffers && (
							<span
								className={
									'z-10 absolute bottom-0 right-0 w-2 h-2 translate-y-1 rounded-full bg-primary'
								}
							/>
						)}
						<AvatarImage
							src={authStateUser.photoURL ?? undefined}
							alt={'profile image'}
						/>
						<AvatarFallback>
							{authStateUser.displayName?.slice(0, 2) ?? 'NA'}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				{/* Mostly example and placeholder content for now */}
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<Link to={'/profile'}>
							<DropdownMenuItem className={'focus:bg-secondary'}>
								Profile
							</DropdownMenuItem>
						</Link>
						<Link to={'/invites'}>
							<DropdownMenuItem className={'gap-1 focus:bg-secondary'}>
								View Notifications{' '}
								{!!hasPendingOffers && (
									<span
										className={
											'self-start w-2 h-2 translate-y-1 rounded-full bg-primary'
										}
									/>
								)}
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem className={'focus:bg-secondary'}>
							Schedule
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem className={'focus:bg-secondary'}>
							View Roster
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger
								className={'focus:bg-secondary data-[state=open]:bg-secondary'}
							>
								Invite Players
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem className={'focus:bg-secondary'}>
										Email
									</DropdownMenuItem>
									<DropdownMenuItem className={'focus:bg-secondary'}>
										Message
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className={'focus:bg-secondary'}>
										More...
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem className={'focus:bg-secondary'}>
							New Team
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem className={'focus:bg-secondary'} onClick={signOut}>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
