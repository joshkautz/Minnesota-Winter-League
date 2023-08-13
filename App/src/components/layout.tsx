import { TopNav } from './top-nav'
import { Outlet } from 'react-router-dom'
import { UserForm } from './user-form'
import { AuthContext } from '@/firebase/auth-context'
import { useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

const content = [
	{ label: 'Home', path: '/', alt: 'home page' },
	{ label: 'Schedule', path: '/schedule', alt: 'league schedule' },
	{ label: 'Standings', path: '/standings', alt: 'league standings' },
	{ label: 'Teams', path: '/teams', alt: 'team list' },
]

export const Layout = () => {
	const authContext = useContext(AuthContext)
	/* TEMP CODE */
	const [debugOpen, setDebugOpen] = useState(false)
	/* END TEMP */

	return (
		<div className={'flex flex-col items-center justify-start min-h-screen'}>
			<TopNav title={'Minnesota Winter League'} content={content} />
			<Outlet />
			{/* TEMP CODE */}
			<Button onClick={() => setDebugOpen(!debugOpen)}>
				{debugOpen ? 'Hide Context' : 'Show Context'}
			</Button>
			<div
				className={cn(
					'w-[400px] max-h-0 p-0 flex-wrap transition-all duration-300 overflow-hidden my-2',
					debugOpen && 'max-h-screen p-2 ring-2 ring-primary'
				)}
			>
				<pre>{JSON.stringify(authContext, null, 2)}</pre>
			</div>
			{/* END TEMP */}
			{!authContext.user && <UserForm />}
		</div>
	)
}
