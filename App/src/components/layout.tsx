import { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { AuthContext } from '@/firebase/auth-context'
import { Button } from '@/components/ui/button'

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
			{process.env.NODE_ENV !== 'production' && (
				<>
					<Button onClick={() => setDebugOpen(!debugOpen)}>
						{debugOpen ? 'Hide Context' : 'Show Context'}
					</Button>
					{debugOpen && (
						<textarea
							readOnly
							rows={25}
							cols={100}
							value={JSON.stringify(authContext, null, 2)}
						/>
					)}
				</>
			)}
			{/* END TEMP */}
		</div>
	)
}
