import {
	getAuth,
	User,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from 'firebase/auth'
import { app } from './app.ts'

const auth = getAuth(app)

const handleSignOut = () => {
	signOut(auth)
}

const handleLogin = ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	return signInWithEmailAndPassword(auth, email, password)
		.then(() => {
			return { success: true, message: 'Login successful!' }
		})
		.catch((err) => {
			return { success: false, message: `Login failed: ${err}` }
		})
}

const handleSignUp = ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			return sendEmailVerification(userCredential.user)
				.then(() => {
					return { success: true, message: 'Account successfully created!' }
				})
				.catch((err) => {
					return {
						success: false,
						message: `Unable to Send Email Verification. Failed with: ${err}`,
					}
				})
		})
		.catch((err) => {
			return {
				success: false,
				message: `Unable to create account. Failed with: ${err}`,
			}
		})
}

export { auth, type User, handleSignOut, handleSignUp, handleLogin }
