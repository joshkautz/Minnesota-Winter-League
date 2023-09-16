import { Routes, Route } from 'react-router-dom'
import { FourOhFour } from '@/components/four-oh-four'
import { Home } from '@/components/home'
import { Layout } from '@/components/layout'
import { Schedule } from '@/components/schedule'
import { Standings } from '@/components/standings'
import { Teams } from '@/components/teams'
import { ProtectedRoute } from '@/components/protected-route'
import { Profile } from '@/components/profile'
import { TeamProfile } from './components/team-profile'
import { ManageOffers } from './components/manage-offers'
import { useContext } from 'react'
import { AuthContext } from './firebase/auth-context'

function App() {
  const { documentSnapshot } = useContext(AuthContext)
  documentSnapshot ?.data()?.team

	return (
		<Routes>
			<Route path={'/'} element={<Layout />}>
				<Route index element={<Home />} />
				<Route path={'/schedule'} element={<Schedule />} />
				<Route path={'/standings'} element={<Standings />} />
				<Route path={'/team'} element={<TeamProfile />} />
				<Route path={'/teams'} element={<Teams />} />
				<Route path={'/teams/:id'} element={<TeamProfile />} />
				<Route
					path={'/profile'}
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path={'/invites'}
					element={
						<ProtectedRoute>
							<ManageOffers />
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path={'*'} element={<FourOhFour />} />
		</Routes>
	)
}

export default App
