import { AuthContext } from '@/firebase/auth-context'
import { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
	const { user } = useContext(AuthContext)

	if (!user) {
		return <Navigate to={'/'} />
	}
	return children
}
