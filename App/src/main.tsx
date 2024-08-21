import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthContextProvider } from '@/firebase/auth-context.tsx'
import { TeamsContextProvider } from '@/firebase/teams-context.tsx'
import { OffersContextProvider } from '@/firebase/offers-context.tsx'
import { SeasonsContextProvider } from '@/firebase/seasons-context.tsx'
import { ThemeProvider } from './components/theme-context.tsx'
import { GamesContextProvider } from './firebase/games-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ThemeProvider>
		<AuthContextProvider>
			<SeasonsContextProvider>
				<TeamsContextProvider>
					<GamesContextProvider>
						<OffersContextProvider>
							<BrowserRouter>
								<App />
								<Toaster />
							</BrowserRouter>
						</OffersContextProvider>
					</GamesContextProvider>
				</TeamsContextProvider>
			</SeasonsContextProvider>
		</AuthContextProvider>
	</ThemeProvider>
)
