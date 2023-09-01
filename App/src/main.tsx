import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthContextProvider } from '@/firebase/auth-context.tsx'
import { TeamsContextProvider } from '@/firebase/teams-context.tsx'
import { OffersContextProvider } from '@/firebase/offers-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<AuthContextProvider>
		<TeamsContextProvider>
			<OffersContextProvider>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</OffersContextProvider>
		</TeamsContextProvider>
	</AuthContextProvider>
)
