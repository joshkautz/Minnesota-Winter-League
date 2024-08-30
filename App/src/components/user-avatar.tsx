import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthContext } from '@/contexts/auth-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { UserForm } from '@/components/user-form'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { useOffersContext } from '@/contexts/offers-context'
import { useMemo } from 'react'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const getInitials = (
	firstname: string | undefined,
	lastname: string | undefined
) => {
	if (!firstname || !lastname) return 'NA'
	return firstname.slice(0, 1) + lastname.slice(0, 1)
}
export const UserAvatar = ({
	userContent,
}: {
	userContent: { label: string; path: string; alt: string }[]
}) => {
	const {
		authStateUser,
		authStateLoading,
		authenticatedUserSnapshot,
		signOut,
	} = useAuthContext()
	const { incomingOffersQuerySnapshot } = useOffersContext()

	const userInitials = useMemo(
		() =>
			getInitials(
				authenticatedUserSnapshot?.data()?.firstname,
				authenticatedUserSnapshot?.data()?.lastname
			),
		[authenticatedUserSnapshot]
	)

	const hasPendingOffers = incomingOffersQuerySnapshot?.docs.filter(
		(entry) => entry.data().status === 'pending'
	).length
	const isVerified = authStateUser?.emailVerified
	const isRegistered = authenticatedUserSnapshot?.data()?.registered
	const hasRequiredTasks = !isVerified || !isRegistered

	const isLoading = useMemo(
		() =>
			(!authStateUser && authStateLoading) ||
			(authStateUser && !authenticatedUserSnapshot),
		[authStateUser, authStateLoading, authenticatedUserSnapshot]
	)

	if (isLoading) {
		return <ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
	}

	if (!authStateUser) {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button variant={'default'}>Login</Button>
				</DialogTrigger>
				<VisuallyHidden>
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>Login</DialogDescription>
				</VisuallyHidden>
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
						{(!!hasPendingOffers || hasRequiredTasks) && (
							<span
								className={
									'z-10 absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary'
								}
							/>
						)}
						{/* I dont think we even have this anymore... */}
						<AvatarImage
							src={authStateUser.photoURL ?? undefined}
							alt={'profile image'}
						/>
						<AvatarFallback
							className={
								'transition-colors bg-secondary hover:bg-accent dark:hover:text-background uppercase'
							}
						>
							{userInitials}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				{/* Mostly example and placeholder content for now */}
				<DropdownMenuContent className={'w-56'}>
					<DropdownMenuGroup>
						{userContent.map(({ label, path, alt }) => (
							<Link key={path} to={path} aria-label={alt}>
								{path === '/manage' && !!hasPendingOffers ? (
									<DropdownMenuItem className={'gap-1 cursor-pointer'}>
										{label}{' '}
										<span className="relative flex w-2 h-2 -translate-y-1">
											{/* <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span> */}
											<span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
										</span>
									</DropdownMenuItem>
								) : path === '/profile' && hasRequiredTasks ? (
									<DropdownMenuItem className={'gap-1 cursor-pointer'}>
										{label}{' '}
										<span className="relative flex w-2 h-2 -translate-y-1">
											{/* <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span> */}
											<span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
										</span>
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem className="cursor-pointer">
										{label}
									</DropdownMenuItem>
								)}
							</Link>
						))}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
