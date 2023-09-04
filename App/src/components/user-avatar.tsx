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
	const { incomingOffersCollectionDataSnapshot } = useContext(OffersContext)

	const hasPendingOffers = incomingOffersCollectionDataSnapshot?.docs.filter(
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
					<Avatar className={'cursor-pointer overflow-visible'}>
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
							<DropdownMenuItem className={'cursor-pointer'}>
								Profile
							</DropdownMenuItem>
						</Link>
						<Link to={'/invites'}>
							<DropdownMenuItem className={'cursor-pointer gap-1'}>
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
						<DropdownMenuItem>Schedule</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>View Roster</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Invite Players</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>Email</DropdownMenuItem>
									<DropdownMenuItem>Message</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>More...</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem>New Team</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem disabled>GitHub</DropdownMenuItem>
					<DropdownMenuItem disabled>Support</DropdownMenuItem>
					<DropdownMenuItem disabled>API</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
