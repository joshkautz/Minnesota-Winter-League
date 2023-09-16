import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'

export const Layout = () => {
	return (
		<div className={'flex flex-col items-center justify-start min-h-screen'}>
			<TopNav title={'Minnesota Winter League'} />
			<Outlet />
		</div>
	)
}
