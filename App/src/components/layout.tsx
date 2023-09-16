import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'

const content = [
	{ label: 'Home', path: '/', alt: 'home page' },
	{ label: 'Schedule', path: '/schedule', alt: 'league schedule' },
	{ label: 'Standings', path: '/standings', alt: 'league standings' },
	{ label: 'Teams', path: '/teams', alt: 'team list' },
]

export const Layout = () => {
	return (
		<div className={'flex flex-col items-center justify-start min-h-screen'}>
			<TopNav title={'🥏'} content={content} />
			<Outlet />
		</div>
	)
}
