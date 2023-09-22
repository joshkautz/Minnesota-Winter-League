import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { cn } from '@/lib/utils'

export const Layout = () => {
	const { pathname } = useLocation()

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-start min-h-screen',
				pathname !== '/' && 'pb-10'
			)}
		>
			<TopNav title={'🥏'} />
			<Outlet />
		</div>
	)
}
