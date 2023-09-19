import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/top-nav'
import { leaveTeam } from '@/firebase/firestore'
import { useContext } from 'react'
import { AuthContext } from '@/firebase/auth-context'
import { Button } from './ui/button'

export const Layout = () => {
	const { documentSnapshot, documentSnapshotLoading } = useContext(AuthContext)
	const teamRef = documentSnapshot?.data()?.team
	return (
		<div className={'flex flex-col items-center justify-start min-h-screen'}>
			<TopNav title={'🥏'} />
			<Button
				onClick={() => {
					if (!documentSnapshot?.ref || !teamRef) {
						return
					}

					leaveTeam(documentSnapshot?.ref, teamRef)
				}}
				disabled={documentSnapshotLoading || !teamRef}
			>
				Leave Team
			</Button>
			<Outlet />
		</div>
	)
}
