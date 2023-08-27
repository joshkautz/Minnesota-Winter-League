// React
import { PropsWithChildren, createContext } from 'react'

// Firebase Hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'

// Winter League
import { auth, User } from '@/firebase/auth'
import { userDocRef, DocumentData, FirestoreError } from '@/firebase/firestore'
import { useOffers } from '@/hooks/use-offers'

interface AuthProps {
	user: User | null | undefined
	loading: boolean
	error: Error | undefined
	firestoreValue: DocumentData | undefined
	firestoreLoading: boolean
	firestoreError: FirestoreError | undefined
	offers: DocumentData[]
}
const AuthContext = createContext<AuthProps>({} as AuthProps)

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [authValue, authLoading, authError] = useAuthState(auth)
	const [firestoreValue, firestoreLoading, firestoreError] = useDocumentData(
		userDocRef(authValue)
	)

	const { offers } = useOffers(authValue, firestoreValue)

	return (
		<AuthContext.Provider
			value={{
				user: authValue,
				loading: authLoading,
				error: authError,
				firestoreValue: firestoreValue,
				firestoreLoading: firestoreLoading,
				firestoreError: firestoreError,
				offers: offers,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthContextProvider }
