import { getAuth, User, UserCredential, AuthError, ActionCodeSettings } from 'firebase/auth'

import { app } from './app.ts'

const auth = getAuth(app)

export { auth, type AuthError, type User, type UserCredential, type ActionCodeSettings }
