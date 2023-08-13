import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthContextProvider } from '@/contexts/auth-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<AuthContextProvider>
		<BrowserRouter>
			<App />
			<Toaster />
		</BrowserRouter>
	</AuthContextProvider>
	// </React.StrictMode>
)
