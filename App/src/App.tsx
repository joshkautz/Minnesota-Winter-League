import { Routes, Route } from 'react-router-dom'
import { FourOhFour } from './components/four-oh-four'
import { Home } from './components/home'
import { Layout } from './components/layout'
import { Schedule } from './components/schedule'
import { Standings } from './components/standings'
import { Teams } from './components/teams'

function App() {
	return (
		<div>
			<Routes>
				<Route path={'/'} element={<Layout />}>
					<Route index element={<Home />} />
					<Route path={'/schedule'} element={<Schedule />} />
					<Route path={'/standings'} element={<Standings />} />
					<Route path={'/teams'} element={<Teams />} />
				</Route>
				<Route path={'*'} element={<FourOhFour />} />
			</Routes>
		</div>
	)
}

export default App
