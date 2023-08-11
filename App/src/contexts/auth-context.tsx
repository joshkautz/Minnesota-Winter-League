// React
import { createContext, useEffect } from 'react'

// Firebase Hooks
import {
	useAuthState,
	useCreateUserWithEmailAndPassword,
	useSignOut,
} from 'react-firebase-hooks/auth'

// Winter League
import { auth } from '@/firebase/auth'
import { AuthContextType } from '@/types/AuthContextType'
import { Props } from '@/interfaces/Props'

const AuthContext = createContext<AuthContextType | null>(null)

const AuthContextProvider = ({ children }: Props) => {
	const [authValue, authLoading, authError] = useAuthState(auth)
	const [
		createUserWithEmailAndPassword,
		createUserWithEmailAndPasswordUser,
		createUserWithEmailAndPasswordLoading,
		createUserWithEmailAndPasswordError,
	] = useCreateUserWithEmailAndPassword(auth)
	const [signOut, signOutLoading, signOutError] = useSignOut(auth)

	console.log(authValue, authLoading, authError)

	useEffect(() => {
		console.log(
			createUserWithEmailAndPasswordUser,
			createUserWithEmailAndPasswordLoading,
			createUserWithEmailAndPasswordError
		)
	}, [createUserWithEmailAndPasswordUser])

	return (
		<AuthContext.Provider
			value={{
				auth: auth,
				authValue: authValue,
				authLoading: authLoading,
				authError: authError,
				createUserWithEmailAndPassword: createUserWithEmailAndPassword,
				createUserWithEmailAndPasswordUser: createUserWithEmailAndPasswordUser,
				createUserWithEmailAndPasswordLoading:
					createUserWithEmailAndPasswordLoading,
				createUserWithEmailAndPasswordError:
					createUserWithEmailAndPasswordError,
				signOut: signOut,
				signOutLoading: signOutLoading,
				signOutError: signOutError,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthContextProvider }
