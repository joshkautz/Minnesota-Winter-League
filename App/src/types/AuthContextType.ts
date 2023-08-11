// types.AuthContextType.ts
import { Auth, AuthError, User, UserCredential } from 'firebase/auth'

export type AuthContextType = {
	auth: Auth
	authValue: User | null | undefined
	authLoading: boolean
	authError: Error | undefined
	createUserWithEmailAndPassword: (
		email: string,
		password: string
	) => Promise<UserCredential | undefined>
	createUserWithEmailAndPasswordUser: UserCredential | undefined
	createUserWithEmailAndPasswordLoading: boolean
	createUserWithEmailAndPasswordError: AuthError | undefined
	signOut: () => Promise<boolean>
	signOutLoading: boolean
	signOutError: AuthError | Error | undefined
}
