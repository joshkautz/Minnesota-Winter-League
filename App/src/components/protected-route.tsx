import { AuthContext } from '@/firebase/auth-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
	const { authStateUser, authStateLoading } = useContext(AuthContext)

	if (authStateLoading) {
		return (
			<div className="ring h-[calc(100vh-60px)] w-full items-center justify-center flex">
				<ReloadIcon className={'h-10 w-10 animate-spin'} />
			</div>
		)
	}

	if (!authStateUser) {
		return <Navigate to={'/'} />
	}

	return children
}
