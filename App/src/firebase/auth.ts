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

const handleLogin = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	try {
    await signInWithEmailAndPassword(auth, email, password)
    return { success: true, message: 'Login successful!' }
  } catch (err) {
    return { success: false, message: `Login failed: ${err}` }
  }
}

const handleSignUp = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    try {
      await sendEmailVerification(userCredential.user)
      return { success: true, message: 'Account successfully created!' }
    } catch (err) {
      return {
        success: false,
        message: `Unable to Send Email Verification. Failed with: ${err}`,
      }
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to create account. Failed with: ${err}`,
    }
  }
}

export { auth, type User, handleSignOut, handleSignUp, handleLogin }
