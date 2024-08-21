import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { SeasonSelect } from './season-select'

export type OutletContext = {
	toggleIsOpen: () => void
}

export const Layout = () => {
	const { pathname } = useLocation()
	// moved isOpen up to Layout so I can share it between TopNav and Home
	const [isOpen, setIsOpen] = useState(false)

	const toggleIsOpen = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-start min-h-screen',
				pathname !== '/' && 'pb-10'
			)}
		>
			<TopNav isOpen={isOpen} setIsOpen={toggleIsOpen} />
			{/* pass toggleIsOpen using outlet context from react router dom */}
			<SeasonSelect />
			<Outlet context={{ toggleIsOpen } satisfies OutletContext} />
		</div>
	)
}
