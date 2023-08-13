import { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { AuthContext } from '@/firebase/auth-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/auth-button'

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
			<AuthButton
				className={'mb-2'}
				loading={authContext.loading}
				user={authContext.user}
			/>
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
		</div>
	)
}
