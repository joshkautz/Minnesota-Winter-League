import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AuthContext } from '@/firebase/auth-context'
import { UserAvatar } from '@/components/user-avatar'
import { AuthButton } from '@/components/auth-button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from './ui/theme-toggle'

export const TopNav = ({ title }: { title: string }) => {
	const { authStateUser, authStateLoading, documentSnapshot } =
		useContext(AuthContext)
	const [open, setOpen] = useState(false)

	const isRostered = documentSnapshot?.data()?.team
	const isCaptain = documentSnapshot?.data()?.captain

	const navContent = [
		{ label: 'Home', path: '/#welcome', alt: 'home page' },
		{ label: 'Schedule', path: '/schedule', alt: 'league schedule' },
		{ label: 'Standings', path: '/standings', alt: 'league standings' },
		{ label: 'Teams', path: '/teams', alt: 'team list' },
	]

	const captainContent = [
		{ label: 'Manage Team', path: '/invites', alt: 'team management' },
	]
	const rosteredContent = [
		{ label: 'Your Team', path: '/team', alt: 'team profile' },
	]
	const unrosteredContent = [
		{ label: 'Join a Team', path: '/invites', alt: 'invite management' },
		{ label: 'Create a Team', path: '/', alt: 'team creation' },
	]

	const userContent = [
		{ label: 'Edit Profile', path: '/profile', alt: 'user profile' },
		...(authStateUser
			? isCaptain
				? captainContent
				: isRostered
				? rosteredContent
				: unrosteredContent
			: []),
	]

	const handleClick = () => {
		setOpen(!open)
	}

	return (
		<header
			className={
				'sticky top-0 z-50 w-full border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur'
			}
		>
			<div className={'container flex items-center h-14'}>
				{/* Nav */}
				<div className={'hidden mr-4 md:flex md:flex-1'}>
					<Link to={'/'} className={'flex items-center mr-6 space-x-2'}>
						{/* <div className={'w-6 h-6 rounded-full bg-primary'} /> */}
						<span className={'hidden font-bold sm:inline-block'}>{title}</span>
					</Link>
					<nav
						className={
							'flex items-center justify-start space-x-6 text-sm font-medium flex-1'
						}
					>
						{navContent.map((entry) => (
							<Link
								key={entry.path}
								to={entry.path}
								className={
									'transition-colors hover:text-foreground/80 text-foreground/60'
								}
							>
								{entry.label}
							</Link>
						))}
						<div className="flex items-center justify-end flex-1 gap-4">
							<div>
								<ThemeToggle />
							</div>

							<UserAvatar userContent={userContent} />
						</div>
					</nav>
				</div>

				{/* Mobile */}
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button
							variant={'ghost'}
							className={
								'px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
							}
						>
							<HamburgerMenuIcon className={'w-5 h-5'} />
							<span className={'sr-only'}>Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side={'top'} className={'pr-0'}>
						<Link
							to={'/'}
							className={'flex items-center'}
							onClick={handleClick}
						>
							{/* <div className={'w-6 h-6 rounded-full bg-primary'} /> */}
							{/* <span className={'ml-1 hidden font-bold sm:inline-block'}>
								Minneapolis Winter League
							</span> */}
						</Link>
						<ScrollArea className={'my-4 h-[calc(100vh-8rem)] pb-10 px-6'}>
							<div className={'flex flex-col space-y-3'}>
								{navContent.map(({ path, label, alt }) => (
									<Link
										key={path}
										to={path}
										aria-label={alt}
										onClick={handleClick}
									>
										{label}
									</Link>
								))}
								{authStateUser && (
									// Mostly placeholder links for now will refine later.
									<>
										<Separator />
										{userContent.map(({ path, label, alt }) => (
											<Link
												key={path}
												to={path}
												aria-label={alt}
												onClick={handleClick}
											>
												{label}
											</Link>
										))}
										<Separator />
									</>
								)}
								<AuthButton loading={authStateLoading} user={authStateUser} />
							</div>
						</ScrollArea>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
}
