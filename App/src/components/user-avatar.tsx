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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { OffersContext } from '@/firebase/offers-context'

export const UserAvatar = ({
	userContent,
}: {
	userContent: { label: string; path: string; alt: string }[]
}) => {
	const { authStateUser, authStateLoading, documentSnapshot, signOut } =
		useContext(AuthContext)
	const { incomingOffersQuerySnapshot } = useContext(OffersContext)

	const userInitials = `${
		documentSnapshot?.data()?.firstname.slice(0, 1) ?? ''
	}${documentSnapshot?.data()?.lastname.slice(0, 1) ?? ''}`

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
						{/* I dont think we even have this anymore... */}
						<AvatarImage
							src={authStateUser.photoURL ?? undefined}
							alt={'profile image'}
						/>
						<AvatarFallback className="bg-secondary hover:bg-accent">
							{!userInitials ? 'NA' : userInitials}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				{/* Mostly example and placeholder content for now */}
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						{userContent.map(({ label, path, alt }) => {
							return (
								<Link key={path} to={path} aria-label={alt}>
									{path === '/manage' ? (
										<DropdownMenuItem className={'gap-1'}>
											{label}{' '}
											{!!hasPendingOffers && (
												<span
													className={
														'self-start w-2 h-2 translate-y-1 rounded-full bg-primary'
													}
												/>
											)}
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem>{label}</DropdownMenuItem>
									)}
								</Link>
							)
						})}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
