import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type OutletContext = {
	setIsMobileLoginOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Layout = () => {
	const { pathname } = useLocation()

	const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false)

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-start min-h-screen',
				pathname !== '/' && 'pb-10'
			)}
		>
			<TopNav
				isMobileLoginOpen={isMobileLoginOpen}
				setIsMobileLoginOpen={setIsMobileLoginOpen}
			/>
			<Outlet context={{ setIsMobileLoginOpen } satisfies OutletContext} />
		</div>
	)
}
