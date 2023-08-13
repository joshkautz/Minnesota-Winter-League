// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import {
	useAuthState,
	// 	useCreateUserWithEmailAndPassword,
	// 	useSignOut,
} from 'react-firebase-hooks/auth'

// Winter League
import { auth, User } from '@/firebase/auth'
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

interface AuthProps {
	user: User | null | undefined
	loading: boolean
	error: Error | undefined
}
const AuthContext = createContext<AuthProps>({} as AuthProps)

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [authValue, authLoading, authError] = useAuthState(auth)

	return (
		<AuthContext.Provider
			value={{
				user: authValue,
				loading: authLoading,
				error: authError,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthContextProvider }
