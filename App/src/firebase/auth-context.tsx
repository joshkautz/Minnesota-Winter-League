// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import {
	useAuthState,
	useCreateUserWithEmailAndPassword,
	useSignInWithEmailAndPassword,
	// useUpdateEmail,
	// useUpdatePassword,
	useSendPasswordResetEmail,
	useSendEmailVerification,
	useSignOut,
} from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

// Winter League
import {
	auth,
	User,
	UserCredential,
	AuthError,
	ActionCodeSettings,
} from '@/firebase/auth'
import {
	getPlayerRef,
	FirestoreError,
	DocumentSnapshot,
	DocumentData,
} from '@/firebase/firestore'
import { PlayerData } from '@/lib/interfaces'

interface AuthProps {
	authStateUser: User | null | undefined
	authStateLoading: boolean
	authStateError: Error | undefined
	documentSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
	documentSnapshotLoading: boolean
	documentSnapshotError: FirestoreError | undefined
	createUserWithEmailAndPassword: (
		email: string,
		password: string
	) => Promise<UserCredential | undefined>
	createUserWithEmailAndPasswordUser: UserCredential | undefined
	createUserWithEmailAndPasswordLoading: boolean
	createUserWithEmailAndPasswordError: AuthError | undefined
	signInWithEmailAndPassword: (
		email: string,
		password: string
	) => Promise<UserCredential | undefined>
	signInWithEmailAndPasswordUser: UserCredential | undefined
	signInWithEmailAndPasswordLoading: boolean
	signInWithEmailAndPasswordError: AuthError | undefined
	signOut: () => Promise<boolean>
	signOutLoading: boolean
	signOutError: Error | AuthError | undefined
	sendEmailVerification: () => Promise<boolean>
	sendEmailVerificationSending: boolean
	sendEmailVerificationError: Error | AuthError | undefined
	sendPasswordResetEmail: (
		email: string,
		actionCodeSettings?: ActionCodeSettings | undefined
	) => Promise<boolean>
	sendPasswordResetEmailSending: boolean
	sendPasswordResetEmailError: Error | AuthError | undefined
}
const AuthContext = createContext<AuthProps>({} as AuthProps)

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [authStateUser, authStateLoading, authStateError] = useAuthState(auth)
	const [documentSnapshot, documentSnapshotLoading, documentSnapshotError] =
		useDocument(getPlayerRef(authStateUser))
	const [
		createUserWithEmailAndPassword,
		createUserWithEmailAndPasswordUser,
		createUserWithEmailAndPasswordLoading,
		createUserWithEmailAndPasswordError,
	] = useCreateUserWithEmailAndPassword(auth)
	const [
		signInWithEmailAndPassword,
		signInWithEmailAndPasswordUser,
		signInWithEmailAndPasswordLoading,
		signInWithEmailAndPasswordError,
	] = useSignInWithEmailAndPassword(auth)
	const [signOut, signOutLoading, signOutError] = useSignOut(auth)
	const [
		sendEmailVerification,
		sendEmailVerificationSending,
		sendEmailVerificationError,
	] = useSendEmailVerification(auth)
	const [
		sendPasswordResetEmail,
		sendPasswordResetEmailSending,
		sendPasswordResetEmailError,
	] = useSendPasswordResetEmail(auth)

	return (
		<AuthContext.Provider
			value={{
				authStateUser: authStateUser,
				authStateLoading: authStateLoading,
				authStateError: authStateError,
				documentSnapshot: documentSnapshot as
					| DocumentSnapshot<PlayerData, DocumentData>
					| undefined,
				documentSnapshotLoading: documentSnapshotLoading,
				documentSnapshotError: documentSnapshotError,
				createUserWithEmailAndPassword: createUserWithEmailAndPassword,
				createUserWithEmailAndPasswordUser: createUserWithEmailAndPasswordUser,
				createUserWithEmailAndPasswordLoading:
					createUserWithEmailAndPasswordLoading,
				createUserWithEmailAndPasswordError:
					createUserWithEmailAndPasswordError,
				signInWithEmailAndPassword: signInWithEmailAndPassword,
				signInWithEmailAndPasswordUser: signInWithEmailAndPasswordUser,
				signInWithEmailAndPasswordLoading: signInWithEmailAndPasswordLoading,
				signInWithEmailAndPasswordError: signInWithEmailAndPasswordError,
				signOut: signOut,
				signOutLoading: signOutLoading,
				signOutError: signOutError,
				sendEmailVerification: sendEmailVerification,
				sendEmailVerificationSending: sendEmailVerificationSending,
				sendEmailVerificationError: sendEmailVerificationError,
				sendPasswordResetEmail: sendPasswordResetEmail,
				sendPasswordResetEmailSending: sendPasswordResetEmailSending,
				sendPasswordResetEmailError: sendPasswordResetEmailError,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthContextProvider }
