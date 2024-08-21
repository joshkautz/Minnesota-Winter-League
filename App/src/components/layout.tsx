import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type OutletContext = {
	toggleIsOpen: () => void
}

export const Layout = () => {
	const { pathname } = useLocation()
	const [isOpen, setIsOpen] = useState(false)

	const toggleIsOpen = () => {
		setIsOpen((prevState) => !prevState)
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-start min-h-screen',
				pathname !== '/' && 'pb-10'
			)}
		>
			<TopNav isOpen={isOpen} setIsOpen={toggleIsOpen} />
			<Outlet context={{ toggleIsOpen } satisfies OutletContext} />
		</div>
	)
}
