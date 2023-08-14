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
import { handleSignOut } from '@/firebase/auth'
import { Link } from 'react-router-dom'

export const UserAvatar = () => {
	const { user, loading } = useContext(AuthContext)

	if (loading) {
		return <ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
	}

	if (!user) {
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

	if (user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className={'cursor-pointer'}>
						<AvatarImage
							src={user.photoURL ?? undefined}
							alt={'profile image'}
						/>
						<AvatarFallback>
							{user.displayName?.slice(0, 2) ?? 'NA'}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				{/* Mostly example and placeholder content for now */}
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Link to={'/profile'}>Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>Team</DropdownMenuItem>
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
					<DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
